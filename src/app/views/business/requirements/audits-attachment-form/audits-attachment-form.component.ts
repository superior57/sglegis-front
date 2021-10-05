import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { AppLoaderService } from 'app/services/dialogs/app-loader/app-loader.service';
import { CRUDService } from 'app/services/negocio/CRUDService/CRUDService';

@Component({
  selector: 'app-audits-attachment-form',
  templateUrl: './audits-attachment-form.component.html',
  styleUrls: ['./audits-attachment-form.component.css']
})
export class AuditsAttachmentFormComponent implements OnInit {

  public attachmentForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AuditsAttachmentFormComponent>,
    private loader: AppLoaderService,
    private crudService: CRUDService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.prepareScreen(this.data.payload);
  }

  prepareScreen(record) {
    this.attachmentForm = new FormGroup({
      attachment_description: new FormControl('', [Validators.required]),
      attachment_file: new FormControl('', [Validators.required]),
      audit_item_id: new FormControl(record.audit_item_id, [Validators.required]),
      audit_id: new FormControl(record.audit_id, [Validators.required])
    });
  }

  fileChange(event) {
    this.attachmentForm.controls['attachment_file'].setValue(event.target.files[0]);    
  }

  saveAttachment() {
    let attachment = this.attachmentForm.value;
    let formData = new FormData();
    formData.append('audit_attachment_description', attachment.attachment_description);
    formData.append('attachment_file', attachment.attachment_file);
    formData.append('audit_id', attachment.audit_id);
    formData.append('audit_attachment_item_id', attachment.audit_item_id);
    
    this.loader.open();
    this.crudService.Save(formData, true, "/audit-attachment", null).subscribe(res => {
      this.loader.close();
      this.snackBar.open("Anexo incluído com sucesso!", "", { duration: 3000 });
      this.dialogRef.close("OK");
    }, err => {
      this.loader.close();
      this.dialogRef.close("NOK");
      this.snackBar.open("Ocorreu um erro: " + err, "", { duration: 5000 });
    });
  }
}
