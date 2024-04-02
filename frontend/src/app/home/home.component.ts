import {
  Component,
  OnInit,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { AddDependencyComponent } from "../add-dependency/add-dependency.component";
import { ImposterService } from "../services/imposter.service";
import { Store } from "@ngrx/store";
import { Clipboard } from "@angular/cdk/clipboard";
import { switchMap } from "rxjs/operators";
import { CommonService } from "../services/common.service";
import { ConfirmationDialogComponent } from "../confirmation-dialog/confirmation-dialog.component";
import { forkJoin } from "rxjs";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  imposterArray: any[] = [];
  deletedImposters: any[] = [];
  viewDependency: any = "";
  isCopyAll = false;
  copyAllButtonText = "Copy All";
  copyJSONButtonText = "Copy JSON";
  iconName = "file_copy";
  iconJSONName = "file_copy";
  copyAllButtonColor = "black";
  copyJSONButtonColor = "black";

  constructor(
    private http: HttpClient,
    private matDialogModule: MatDialog,
    private imposterService: ImposterService,
    private store: Store<{ imposter: {} }>,
    private clipboard: Clipboard,
    private commonService: CommonService,
  ) {}

  ngOnInit() {
    this.initData().subscribe(([imposters, deletedImposters]: [any, any]) => {
      this.imposterArray = imposters;
      this.deletedImposters = deletedImposters;
    });
    
    this.imposterService.updateImposterArray.pipe(
      switchMap(() => this.initData())
    ).subscribe(([imposters, deletedImposters]: [any, any]) => {
      this.imposterArray = imposters;
      this.deletedImposters = deletedImposters;
      this.onViewImposter(this.viewDependency?.port || null);
    });
  }

  initData() {
    return forkJoin([ 
      this.imposterService.onGetImposter(),
      this.imposterService.getDeletedImposters(),
    ]);
  }

  onViewImposter(port) {
    if (port) {
      this.imposterService.onViewImposter(port).subscribe((responseData) => {
        this.viewDependency = responseData;
      });
    }
  }

  onViewDeletedImposter(deletedImposter) {
    this.viewDependency = deletedImposter;
  }

  onAddImposter() {
    this.matDialogModule.open(AddDependencyComponent, {
      width: '60%',
    });
  }

  onEditImposter(imposter) {
    this.matDialogModule.open(AddDependencyComponent, {
      data: { imposter: imposter },
      width: '60%',
    });
  }

  onDeleteImposter(port, index) {
    const dialogRef = this.matDialogModule.open(ConfirmationDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.imposterService.onDeleteImposter(port, index);
        this.viewDependency = "";
      }
    });
  }

  onRestoreDeletedImposter(port: number) {
    this.imposterService.onRestoreDeletedImposter(port).subscribe(
      () => {
        this.imposterService.updateImposterArray.next();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onCopyJSON() {
    this.clipboard.copy(JSON.stringify(this.viewDependency));
    this.copyJSONButtonText = "Copied!";
    this.iconJSONName = "done";
    this.copyJSONButtonColor = "green";
    setTimeout(() => {
      this.copyJSONButtonText = "Copy JSON";
      this.iconJSONName = "file_copy";
      this.copyJSONButtonColor = "black";
    }, 2000);
  }

  onCopyAll() {
    this.clipboard.copy(JSON.stringify(this.imposterArray));
    this.copyAllButtonText = "Copied!";
    this.iconName = "done";
    this.copyAllButtonColor = "green";
    setTimeout(() => {
      this.copyAllButtonText = "Copy All";
      this.iconName = "file_copy";
      this.copyAllButtonColor = "black";
    }, 2000);
  }

  openPostman(data) {
    console.log("clicked");
    // window.open('postman://app', '_blank');
    //response for selected imposter
    // this.imposterService.onViewImposter(data).subscribe((res) => {
    //   console.log(res);
    // });
    this.imposterService.onExportImposter(6001);
  }

  getFormatedQuery(queryValue) {
    return this.commonService.getFormatedQuery(queryValue);
  }
}
