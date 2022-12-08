import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { PostService } from './post.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedPosts: Post[] = [];
  isFetching = false;

  constructor(private http: HttpClient, private postService: PostService) { }

  ngOnInit() {
    this.fetchPosts();
  }

  onMountebank(mountebankData) {

  }

  onMountebankTest() {
    this.http
      .get('http://127.0.0.1:5001')
      .subscribe(data => {
        console.log(data);
      })
  }


  onCreatePost(postData: Post) {
    // Send Http request
    this.postService.createAndStorePost(postData.title, postData.content);

  }

  onFetchPosts() {
    // Send Http request
    this.fetchPosts();


  }

  onClearPosts() {
    // Send Http request
    this.postService.clearPosts().subscribe(() => {
      this.loadedPosts = [];
    });
  }

  private fetchPosts() {
    this.isFetching = true;
    this.postService.fetchPost().subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
    });

  }

}



