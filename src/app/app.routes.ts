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
