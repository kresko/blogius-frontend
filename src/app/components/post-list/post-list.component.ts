import { Component, OnInit, signal } from "@angular/core";
import { Post } from "../../models/post.model";
import { PostService } from "../../services/post.service";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@Component({
    selector: 'app-post-list',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
    posts = signal<Post[]>([]);
    loading = signal(true);

    constructor(private postService: PostService) {}

    ngOnInit(): void {
        this.loadPosts();
    }

    loadPosts(): void {
        this.postService.getAllPosts().subscribe({
            next: (data) => {
                this.posts.set(data);
                this.loading.set(false);
            },
            error: (error) => {
                console.error('Error loading posts:', error);
                this.loading.set(false);
            }
        });
    }

    deletePost(id: number | undefined): void {
        if (!id) return;

        if (confirm('Are you sure you want to delete this post?')) {
            this.postService.deletePost(id).subscribe({
                next: () => {
                    this.loadPosts();
                },
                error: (error) => console.error('Error deleteing post:', error)
            });
        }
    };
}
