import { Component, OnInit, signal } from "@angular/core";
import { Post } from "../../models/post.model";
import { PostService } from "../../services/post.service";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'app-post-detail',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './post-detail.component.html',
    styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
    post = signal<Post | undefined>(undefined);
    loading = signal(true);

    constructor(
        private postService: PostService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadPost(+id);
        }
    }

    loadPost(id: number): void {
        this.postService.getPost(id).subscribe({
            next: (data) => {
                this.post.set(data);
                this.loading.set(false);
            },
            error: (error) => {
                console.error('Error loading post:', error);
                this.loading.set(false);
            }
        });
    }

    deletePost(): void {
        const post = this.post();
        if (!post?.id) return;

        if (confirm('Are you sure you want to delete this post?')) {
            this.postService.deletePost(post.id).subscribe({
                next: () => {
                    this.router.navigate(['/posts']);
                },
                error: (error) => console.error('Error deleting post:', error)
            });
        }
    }

    goBack(): void {
        this.router.navigate(['/posts']);
    }
}
