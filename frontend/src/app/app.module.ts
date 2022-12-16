import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddDependencyComponent } from './add-dependency/add-dependency.component';
import { ImposterService } from './services/imposter.service';
import { StoreModule } from '@ngrx/store';
import { imposterReducer } from './store/imposter.reducer';


@NgModule({
  declarations: [AppComponent, HomeComponent, AddDependencyComponent],
  imports: [BrowserModule, 
    FormsModule, 
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    StoreModule.forRoot({imposter: imposterReducer}) 
  ],
  providers: [ImposterService],
  bootstrap: [AppComponent]
})
export class AppModule {}
