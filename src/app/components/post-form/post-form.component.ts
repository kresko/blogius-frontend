import { Component, OnInit, ChangeDetectorRef, signal } from "@angular/core"
import { Post } from "../../models/post.model"
import { PostService } from "../../services/post.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
    selector: 'app-post-form',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './post-form.component.html',
    styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit {
    post: Post = {
        title: '',
        content: '',
        author: ''
    }

    isEditMode = signal(false);
    postId?: number;
    isSubmitting = signal(false);

    constructor(
        private postService: PostService,
        private route: ActivatedRoute,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode.set(true);
            this.postId = +id;
            this.loadPost(this.postId);
        }
    }

    loadPost(id: number): void {
        this.postService.getPost(id).subscribe({
            next: (data) => {
                this.post = data;
                this.cdr.detectChanges();
            },
            error: (error) => console.error('Error loading post:', error)
        });
    }

    onSubmit(): void {
        this.isSubmitting.set(true);

        const request$ = this.isEditMode() && this.postId
            ? this.postService.updatePost(this.postId, this.post)
            : this.postService.createPost(this.post);

        request$.subscribe({
            next: () => {
                this.router.navigate(['/posts']);
            },
            error: (error) => {
                console.error(`Error ${this.isEditMode() ? 'updating' : 'creating'} post:`, error);
                this.isSubmitting.set(false);
            }
        });
    }

    cancel(): void {
        this.router.navigate(['/posts']);
    }
}
