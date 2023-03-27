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
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PredicatesComponent } from './predicates/predicates.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormService } from './services/form.services';
import { HeaderComponent } from './header/header.component';
import { SubPredicatesComponent } from './predicates/sub-predicates/sub-predicates.component';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [AppComponent, 
    HomeComponent, 
    AddDependencyComponent, 
    PredicatesComponent, 
    HeaderComponent, 
    SubPredicatesComponent
  ],
  imports: [BrowserModule, 
    FormsModule, 
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    StoreModule.forRoot({imposter: imposterReducer}),
    MatMenuModule
  ],
  providers: [ImposterService, FormService],
  bootstrap: [AppComponent]
})
export class AppModule {}
