import { OnInit } from "@angular/core";
import { Post } from "../../models/post.model";
import { PostService } from "../../services/post.service";

export class PostListComponent implements OnInit {
    posts: Post[] = [];
    loading = true;

    constructor(private postService: PostService) {}
}