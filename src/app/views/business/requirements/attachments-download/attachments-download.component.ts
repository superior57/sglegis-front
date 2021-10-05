import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { AppLoaderService } from 'app/services/dialogs/app-loader/app-loader.service';
import { CRUDService } from 'app/services/negocio/CRUDService/CRUDService';
import * as moment from "moment";
import { roles } from 'app/models/auth/roles';
import { AuthGuard } from 'app/services/auth/auth.guard';
import { profile } from 'app/models/auth/profile.types';
import { environment } from "environments/environment";
import { AppConfirmService } from 'app/services/dialogs/app-confirm/app-confirm.service';
import { DatePipe, formatDate } from '@angular/common';

@Component({
  selector: 'app-attachments-download',
  templateUrl: './attachments-download.component.html',
  styleUrls: ['./attachments-download.component.css']
})
export class AttachmentsDownloadComponent implements OnInit {
  public documentForm: FormGroup;

  columns2 = [{ prop: 'name', name: 'Nome do documento' }, { prop: 'dt', name: 'Data de upload' }];

  documentAttachments = [];
  auditAttachemnts = [  ];
  currentUser:any;
  roles = roles;
  profile = profile;

  ngOnInit() {
    this.currentUser = this.auth.getUser();
    this.prepareScreen(this.data.payload);
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AttachmentsDownloadComponent>,
    private loader: AppLoaderService,
    private crudService: CRUDService,
    private snackBar: MatSnackBar,
    private confirm: AppConfirmService,
    public dialog: MatDialog,
    private auth: AuthGuard,
  ) { }

  prepareScreen(record) {
    this.getDocumentAttachments(record.document_id);
  }

  getDocumentAttachments(documentId) {
    if (documentId)
      this.crudService.GetParams({ "orderby": "createdAt", "direction": "asc" }, "/document-attachment/attachments/" + documentId).subscribe(res => {
        if (res.status == 200) {
          this.documentAttachments = [];
          this.documentAttachments = res.body.map(att => {
            const date = moment(att.createdAt);          
            return {
              ...att,
              date: date.format('DD/MM/yyyy')
            }
          });                
        }
      });
  }

  removeAttachment(attachment) {
    let attachmentData = attachment.attachment_id;
    
    this.confirm.confirm("Apagar anexo", "Tem certeza que deseja remover o anexo? " + attachmentData).subscribe(result => {
      if (result === true) {
        this.loader.open();
        this.crudService.DeleteParams(attachmentData, "/document-attachment").subscribe(res => {
          this.snackBar.open("O documento anexado foi removido com sucesso!", "", { duration: 3000 });
          this.getDocumentAttachments(this.documentForm.value.document_id);
          this.loader.close();
        }, err => {
          this.loader.close();
          this.snackBar.open("Erro ao remover anexo: " + err, "", { duration: 5000 });
        })
      }
    })
  }

  downloadAttachment(data) {
    window.open(`${environment.fileURL}/${data.attachment_src}`);
  }

  convertData (strData) {
    if (strData.includes('-'))
      return strData;
    if (strData.includes('/'))
      strData = strData.replaceAll('/', '');
    let dia = strData.substring(0, 2);
    let mes = strData.substring(2, 4);
    let ano = strData.substring(4, 8);
    const newData = `${ano}-${mes}-${dia}`
    return newData;
}
}
