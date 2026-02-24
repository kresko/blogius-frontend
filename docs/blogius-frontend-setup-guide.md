# Blogius Frontend Setup Guide

Complete step-by-step guide to building the Angular frontend for Blogius blog application.

---

## Prerequisites

Before starting, ensure you have:
- ✅ Node.js installed (v18 or higher)
- ✅ npm installed (comes with Node.js)
- ✅ Blogius backend running on `http://localhost:8080`

---

## Step 0: Install Angular CLI

Angular CLI is the command-line tool for creating and managing Angular projects.

### Install Angular CLI globally:

```bash
npm install -g @angular/cli
```

### Verify installation:

```bash
ng version
```

You should see Angular CLI version information.

---

## Step 1: Create Angular Project

Navigate to your projects folder (NOT inside blogius-backend!):

```bash
cd ~/projects
```

Create the Angular project:

```bash
ng new blogius-frontend
```

When prompted:
- **Would you like to add Angular routing?** → **Yes**
- **Which stylesheet format would you like to use?** → **CSS**
- **Do you want to enable Server-Side Rendering (SSR)?** → **No**

Navigate into the project:

```bash
cd blogius-frontend
```

---

## Step 2: Install Angular Material (Optional but Recommended)

Angular Material provides pre-built UI components:

```bash
ng add @angular/material
```

When prompted:
- Choose a theme: **Indigo/Pink** (or your preference)
- Set up global typography? → **Yes**
- Include browser animations? → **Yes**

---

## Step 3: Generate Components and Service

Generate all required components and service:

```bash
# Generate components
ng generate component components/post-list
ng generate component components/post-detail
ng generate component components/post-form

# Generate service
ng generate service services/post
```

---

## Step 4: Create Post Model

**File: `src/app/models/post.model.ts`**

Create the `models` folder first:

```bash
mkdir -p src/app/models
```

Then create the file with this content:

```typescript
export interface Post {
  id?: number;
  title: string;
  content: string;
  author: string;
  createdAt?: string;
  updatedAt?: string;
}
```

---

## Step 5: Configure Post Service

**File: `src/app/services/post.service.ts`**

Replace the content with:

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:8080/api/posts';

  constructor(private http: HttpClient) {}

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }

  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post);
  }

  updatePost(id: number, post: Post): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${id}`, post);
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

---

## Step 6: Configure App Module/Config

**File: `src/app/app.config.ts`** (Angular 17+ standalone)

Replace the content with:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync()
  ]
};
```

---

## Step 7: Setup Routes

**File: `src/app/app.routes.ts`**

Replace the content with:

```typescript
import { Routes } from '@angular/router';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { PostFormComponent } from './components/post-form/post-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/posts', pathMatch: 'full' },
  { path: 'posts', component: PostListComponent },
  { path: 'posts/new', component: PostFormComponent },
  { path: 'posts/:id', component: PostDetailComponent },
  { path: 'posts/:id/edit', component: PostFormComponent }
];
```

---

## Step 8: Create Post List Component

### TypeScript File

**File: `src/app/components/post-list/post-list.component.ts`**

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  loading = true;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.postService.getAllPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.loading = false;
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
        error: (error) => console.error('Error deleting post:', error)
      });
    }
  }
}
```

### HTML Template

**File: `src/app/components/post-list/post-list.component.html`**

```html
<div class="container">
  <h1>Blogius - All Posts</h1>
  
  <button routerLink="/posts/new" class="btn-primary">
    ✍️ Create New Post
  </button>

  <div *ngIf="loading" class="loading">
    Loading posts...
  </div>

  <div *ngIf="!loading && posts.length === 0" class="no-posts">
    <p>No posts yet. Create your first post!</p>
  </div>

  <div class="posts-grid">
    <div *ngFor="let post of posts" class="post-card">
      <h2>{{ post.title }}</h2>
      <p class="author">By {{ post.author }}</p>
      <p class="excerpt">{{ post.content.substring(0, 150) }}...</p>
      <p class="date">{{ post.createdAt | date:'medium' }}</p>
      
      <div class="actions">
        <button [routerLink]="['/posts', post.id]" class="btn-view">
          View
        </button>
        <button [routerLink]="['/posts', post.id, 'edit']" class="btn-edit">
          Edit
        </button>
        <button (click)="deletePost(post.id)" class="btn-delete">
          Delete
        </button>
      </div>
    </div>
  </div>
</div>
```

### CSS Styles

**File: `src/app/components/post-list/post-list.component.css`**

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #333;
  margin-bottom: 2rem;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 2rem;
}

.btn-primary:hover {
  background-color: #45a049;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.post-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.post-card h2 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.author {
  color: #7f8c8d;
  font-style: italic;
  margin: 0.5rem 0;
}

.excerpt {
  color: #555;
  line-height: 1.6;
  margin: 1rem 0;
}

.date {
  color: #95a5a6;
  font-size: 0.9rem;
  margin: 0.5rem 0;
}

.actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn-view, .btn-edit, .btn-delete {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-view {
  background-color: #3498db;
  color: white;
}

.btn-edit {
  background-color: #f39c12;
  color: white;
}

.btn-delete {
  background-color: #e74c3c;
  color: white;
}

.loading, .no-posts {
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
  font-size: 1.2rem;
}
```

---

## Step 9: Create Post Form Component

### TypeScript File

**File: `src/app/components/post-form/post-form.component.ts`**

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';

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
  };
  
  isEditMode = false;
  postId?: number;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.postId = +id;
      this.loadPost(this.postId);
    }
  }

  loadPost(id: number): void {
    this.postService.getPost(id).subscribe({
      next: (data) => {
        this.post = data;
      },
      error: (error) => console.error('Error loading post:', error)
    });
  }

  onSubmit(): void {
    if (this.isEditMode && this.postId) {
      this.postService.updatePost(this.postId, this.post).subscribe({
        next: () => {
          this.router.navigate(['/posts']);
        },
        error: (error) => console.error('Error updating post:', error)
      });
    } else {
      this.postService.createPost(this.post).subscribe({
        next: () => {
          this.router.navigate(['/posts']);
        },
        error: (error) => console.error('Error creating post:', error)
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/posts']);
  }
}
```

### HTML Template

**File: `src/app/components/post-form/post-form.component.html`**

```html
<div class="container">
  <h1>{{ isEditMode ? 'Edit Post' : 'Create New Post' }}</h1>

  <form (ngSubmit)="onSubmit()" #postForm="ngForm">
    <div class="form-group">
      <label for="title">Title *</label>
      <input
        type="text"
        id="title"
        name="title"
        [(ngModel)]="post.title"
        required
        #title="ngModel"
        class="form-control"
      />
      <div *ngIf="title.invalid && title.touched" class="error">
        Title is required
      </div>
    </div>

    <div class="form-group">
      <label for="author">Author *</label>
      <input
        type="text"
        id="author"
        name="author"
        [(ngModel)]="post.author"
        required
        #author="ngModel"
        class="form-control"
      />
      <div *ngIf="author.invalid && author.touched" class="error">
        Author is required
      </div>
    </div>

    <div class="form-group">
      <label for="content">Content *</label>
      <textarea
        id="content"
        name="content"
        [(ngModel)]="post.content"
        required
        #content="ngModel"
        rows="10"
        class="form-control"
      ></textarea>
      <div *ngIf="content.invalid && content.touched" class="error">
        Content is required
      </div>
    </div>

    <div class="form-actions">
      <button type="submit" [disabled]="postForm.invalid" class="btn-submit">
        {{ isEditMode ? 'Update' : 'Create' }} Post
      </button>
      <button type="button" (click)="cancel()" class="btn-cancel">
        Cancel
      </button>
    </div>
  </form>
</div>
```

### CSS Styles

**File: `src/app/components/post-form/post-form.component.css`**

```css
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #333;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #555;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  font-family: inherit;
}

.form-control:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

textarea.form-control {
  resize: vertical;
  min-height: 200px;
}

.error {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 0.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-submit, .btn-cancel {
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn-submit {
  background-color: #4CAF50;
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background-color: #45a049;
}

.btn-submit:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn-cancel {
  background-color: #95a5a6;
  color: white;
}

.btn-cancel:hover {
  background-color: #7f8c8d;
}
```

---

## Step 10: Create Post Detail Component

### TypeScript File

**File: `src/app/components/post-detail/post-detail.component.ts`**

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
  post?: Post;
  loading = true;

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
        this.post = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading post:', error);
        this.loading = false;
      }
    });
  }

  deletePost(): void {
    if (!this.post?.id) return;
    
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(this.post.id).subscribe({
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
```

### HTML Template

**File: `src/app/components/post-detail/post-detail.component.html`**

```html
<div class="container">
  <div *ngIf="loading" class="loading">
    Loading post...
  </div>

  <div *ngIf="!loading && !post" class="not-found">
    <h2>Post not found</h2>
    <button (click)="goBack()" class="btn-back">Back to Posts</button>
  </div>

  <article *ngIf="post" class="post-detail">
    <h1>{{ post.title }}</h1>
    
    <div class="post-meta">
      <span class="author">By {{ post.author }}</span>
      <span class="date">{{ post.createdAt | date:'medium' }}</span>
    </div>

    <div class="post-content">
      {{ post.content }}
    </div>

    <div class="post-actions">
      <button (click)="goBack()" class="btn-back">
        ← Back to Posts
      </button>
      <button [routerLink]="['/posts', post.id, 'edit']" class="btn-edit">
        Edit Post
      </button>
      <button (click)="deletePost()" class="btn-delete">
        Delete Post
      </button>
    </div>
  </article>
</div>
```

### CSS Styles

**File: `src/app/components/post-detail/post-detail.component.css`**

```css
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.post-detail {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h1 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 2.5rem;
}

.post-meta {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #ecf0f1;
}

.author {
  color: #7f8c8d;
  font-style: italic;
}

.date {
  color: #95a5a6;
}

.post-content {
  line-height: 1.8;
  color: #34495e;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  white-space: pre-wrap;
}

.post-actions {
  display: flex;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 2px solid #ecf0f1;
}

.btn-back, .btn-edit, .btn-delete {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn-back {
  background-color: #95a5a6;
  color: white;
}

.btn-edit {
  background-color: #f39c12;
  color: white;
}

.btn-delete {
  background-color: #e74c3c;
  color: white;
  margin-left: auto;
}

.loading, .not-found {
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
  font-size: 1.2rem;
}
```

---

## Step 11: Update App Component

### HTML Template

**File: `src/app/app.component.html`**

Replace the entire content with:

```html
<nav class="navbar">
  <div class="nav-container">
    <h1 routerLink="/" class="logo">📝 Blogius</h1>
    <div class="nav-links">
      <a routerLink="/posts" routerLinkActive="active">All Posts</a>
      <a routerLink="/posts/new" routerLinkActive="active">New Post</a>
    </div>
  </div>
</nav>

<main>
  <router-outlet></router-outlet>
</main>

<footer>
  <p>&copy; 2026 Blogius - Simple Blog Application</p>
</footer>
```

### CSS Styles

**File: `src/app/app.component.css`**

Replace the content with:

```css
.navbar {
  background-color: #2c3e50;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  margin: 0;
  cursor: pointer;
  font-size: 1.8rem;
}

.logo:hover {
  opacity: 0.8;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-size: 1.1rem;
  transition: color 0.2s;
}

.nav-links a:hover,
.nav-links a.active {
  color: #4CAF50;
}

main {
  min-height: calc(100vh - 200px);
  background-color: #f5f5f5;
}

footer {
  background-color: #34495e;
  color: white;
  text-align: center;
  padding: 2rem;
  margin-top: 4rem;
}

footer p {
  margin: 0;
}
```

---

## Step 12: Update Global Styles

**File: `src/styles.css`**

Replace the content with:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
  color: #333;
}

a {
  text-decoration: none;
  color: inherit;
}
```

---

## Step 13: Start the Frontend

Start the Angular development server:

```bash
ng serve
```

Or to open in browser automatically:

```bash
ng serve --open
```

The application will be available at: **http://localhost:4200**

---

## Testing Your Application

### Checklist:

1. ✅ Backend running on http://localhost:8080
2. ✅ Docker running (for backend database)
3. ✅ Frontend running on http://localhost:4200

### Test Features:

1. **View all posts** - Navigate to http://localhost:4200
2. **Create a new post** - Click "Create New Post" button
3. **View post details** - Click "View" on any post
4. **Edit a post** - Click "Edit" button
5. **Delete a post** - Click "Delete" button

---

## Common Issues & Solutions

### Issue: "Cannot GET /api/posts"

**Solution:** Make sure the Quarkus backend is running on port 8080.

```bash
cd blogius-backend
./mvnw quarkus:dev
```

### Issue: CORS errors in browser console

**Solution:** Check your backend `application.properties` has correct CORS configuration:

```properties
quarkus.http.cors.origins=http://localhost:4200
```

### Issue: "Cannot find module '@angular/core'"

**Solution:** Install dependencies:

```bash
npm install
```

### Issue: Posts not loading

**Solution:** 
1. Check browser console for errors
2. Verify backend is running
3. Check Docker is running (for database)
4. Test backend API directly: http://localhost:8080/q/swagger-ui

---

## Project Structure Overview

```
blogius-frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── post-list/
│   │   │   ├── post-detail/
│   │   │   └── post-form/
│   │   ├── models/
│   │   │   └── post.model.ts
│   │   ├── services/
│   │   │   └── post.service.ts
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.css
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── styles.css
│   └── index.html
├── angular.json
├── package.json
└── tsconfig.json
```

---

## Next Steps

Once your application is working, consider these enhancements:

1. **Add search/filter** - Search posts by title or author
2. **Add pagination** - Display posts in pages
3. **Add categories** - Organize posts by category
4. **Add authentication** - Secure post creation/editing
5. **Add comments** - Allow users to comment on posts
6. **Add markdown support** - Rich text formatting
7. **Add image uploads** - Include images in posts
8. **Improve UI** - Use Angular Material components

---

## Useful Commands

```bash
# Start development server
ng serve

# Start and open browser
ng serve --open

# Build for production
ng build

# Run tests
ng test

# Generate new component
ng generate component components/component-name

# Generate new service
ng generate service services/service-name

# Check Angular CLI version
ng version

# Update Angular CLI
npm install -g @angular/cli@latest
```

---

## Resources

- **Angular Documentation:** https://angular.io/docs
- **Angular Material:** https://material.angular.io
- **RxJS Documentation:** https://rxjs.dev
- **Quarkus Guide:** https://quarkus.io/guides/

---

**Happy Coding! 🚀**

If you encounter any issues, check the browser console and terminal for error messages.