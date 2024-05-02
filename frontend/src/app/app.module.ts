import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { MatDialogModule } from "@angular/material/dialog";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { HomeComponent } from "./home/home.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AddDependencyComponent } from "./add-dependency/add-dependency.component";
import { StoreModule } from "@ngrx/store";
import { imposterReducer } from "./store/imposter.reducer";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { PredicatesComponent } from "./predicates/predicates.component";
import { ReactiveFormsModule } from "@angular/forms";
import { HeaderComponent } from "./header/header.component";
import { SubPredicatesComponent } from "./predicates/sub-predicates/sub-predicates.component";
import { MatMenuModule } from "@angular/material/menu";
import { ResponsesComponent } from "./responses/responses.component";
import { StubsComponent } from "./stubs/stubs.component";
import { ConfirmationDialogComponent } from "./confirmation-dialog/confirmation-dialog.component";
import { MatCheckboxModule } from "@angular/material/checkbox";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AddDependencyComponent,
    PredicatesComponent,
    HeaderComponent,
    SubPredicatesComponent,
    ResponsesComponent,
    StubsComponent,
    ConfirmationDialogComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    StoreModule.forRoot({ imposter: imposterReducer }),
    MatMenuModule,
    MatCheckboxModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
