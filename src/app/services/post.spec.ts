import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { PostService } from './post.service';
import { Post } from '../models/post.model';

const API_URL = '/api/posts';

const mockPost: Post = {
  id: 1,
  title: 'Test Post',
  content: 'Test content',
  author: 'Test Author',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const mockPosts: Post[] = [
  mockPost,
  { id: 2, title: 'Second Post', content: 'More content', author: 'Another Author' },
];

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PostService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllPosts()', () => {
    it('should GET all posts from /api/posts', () => {
      let result: Post[] | undefined;

      service.getAllPosts().subscribe(posts => (result = posts));

      const req = httpMock.expectOne(API_URL);
      expect(req.request.method).toBe('GET');
      req.flush(mockPosts);

      expect(result).toEqual(mockPosts);
      expect(result?.length).toBe(2);
    });

    it('should return an empty array when no posts exist', () => {
      let result: Post[] | undefined;

      service.getAllPosts().subscribe(posts => (result = posts));

      httpMock.expectOne(API_URL).flush([]);

      expect(result).toEqual([]);
    });
  });

  describe('getPost()', () => {
    it('should GET a single post by id from /api/posts/:id', () => {
      let result: Post | undefined;

      service.getPost(1).subscribe(post => (result = post));

      const req = httpMock.expectOne(`${API_URL}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPost);

      expect(result).toEqual(mockPost);
    });

    it('should use the correct id in the URL', () => {
      service.getPost(42).subscribe();

      const req = httpMock.expectOne(`${API_URL}/42`);
      expect(req.request.method).toBe('GET');
      req.flush({ id: 42, title: 'Post 42', content: '', author: '' });
    });
  });

  describe('createPost()', () => {
    it('should POST a new post to /api/posts', () => {
      const newPost: Post = { title: 'New Post', content: 'Content', author: 'Author' };
      const createdPost: Post = { ...newPost, id: 3 };
      let result: Post | undefined;

      service.createPost(newPost).subscribe(post => (result = post));

      const req = httpMock.expectOne(API_URL);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newPost);
      req.flush(createdPost);

      expect(result).toEqual(createdPost);
      expect(result?.id).toBe(3);
    });
  });

  describe('updatePost()', () => {
    it('should PUT updated post data to /api/posts/:id', () => {
      const updatedPost: Post = { ...mockPost, title: 'Updated Title' };
      let result: Post | undefined;

      service.updatePost(1, updatedPost).subscribe(post => (result = post));

      const req = httpMock.expectOne(`${API_URL}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedPost);
      req.flush(updatedPost);

      expect(result).toEqual(updatedPost);
      expect(result?.title).toBe('Updated Title');
    });

    it('should use the correct id in the URL', () => {
      service.updatePost(99, mockPost).subscribe();

      const req = httpMock.expectOne(`${API_URL}/99`);
      expect(req.request.method).toBe('PUT');
      req.flush(mockPost);
    });
  });

  describe('deletePost()', () => {
    it('should DELETE a post at /api/posts/:id', () => {
      let completed = false;

      service.deletePost(1).subscribe({ complete: () => (completed = true) });

      const req = httpMock.expectOne(`${API_URL}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);

      expect(completed).toBe(true);
    });

    it('should use the correct id in the URL', () => {
      service.deletePost(7).subscribe();

      const req = httpMock.expectOne(`${API_URL}/7`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
