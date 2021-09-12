import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar, MatDialog } from '@angular/material';
import { CampoBusca } from 'app/models/base/negocio/CampoBusca';
import { AppConfirmService } from 'app/services/dialogs/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/services/dialogs/app-loader/app-loader.service';
import { CRUDService } from 'app/services/negocio/CRUDService/CRUDService';
import { CustomersFormsComponent } from '../../customers/customers-forms/customers-forms.component';

@Component({
  selector: 'app-audits-form',
  templateUrl: './audits-form.component.html',
  styleUrls: ['./audits-form.component.css']
})
export class AuditFormComponent implements OnInit {
  document_items: any[];
  notify: Boolean = false;
  public audit: FormGroup;
  public historicals: any[] = [];
  public featuredHistory = null;
  public conforms = []
  public pratics = []

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<CustomersFormsComponent>,
  private loader: AppLoaderService,
  private crudService: CRUDService,
  private snackBar: MatSnackBar,
  private confirm: AppConfirmService,
  public dialog: MatDialog) {  }

  ngOnInit() {
    this.loadDropdowns();

    this.prepareScreen(this.data.payload);    
  }

  async loadDropdowns() {
    this.conforms = await this.loadConformity();
    this.pratics = await this.loadPraticalOrder();
  };

  prepareScreen(record: any) {
    
    this.audit = new FormGroup({
      audit_id: new FormControl(record.audit_id),
      audit_practical_order: new FormControl('', [Validators.required]),
      audit_conformity: new FormControl('', [Validators.required]),
      audit_evidnece_compliance: new FormControl('', [Validators.required]),
      audit_control_action: new FormControl('', [Validators.required])
    });
    this.getHistorical(record).then((res: any) => {
      if (res) {
        this.featuredHistory = {
          ...res.body[0]
        }
        res.body.splice(0, 1);
        this.historicals = res.body;

        this.audit = new FormGroup({
          audit_id: new FormControl(this.featuredHistory.audit_id  || 0),
          audit_practical_order: new FormControl(this.featuredHistory.audit_practical_order || '', [Validators.required]),
          audit_conformity: new FormControl(this.featuredHistory.audit_conformity || '', [Validators.required]),
          audit_evidnece_compliance: new FormControl(this.featuredHistory.audit_evidnece_compliance || '', [Validators.required]),
          audit_control_action: new FormControl(this.featuredHistory.audit_control_action || '', [Validators.required])
        })
      }
    });
    this.initItems(record);    
  }

  initItems(record: any) {
    const documentItemIds = [];
    this.document_items = [];
    record.forEach(r => {      
      if (!documentItemIds.includes(r.document_item_id)) {        
        documentItemIds.push(r.document_item_id);
        this.document_items.push(r);
      }
    });   
  }

  saveAudit() {
    const datas = this.data.payload;
    const user = this.data.user;
    let audit = this.audit.value;
    this.loader.open();
    datas.forEach(d => {
      let newAudit = {
        audit_id: d.audit_id,
        item_area_aspect_id: d.item_area_aspect_id,
        unit_id: d.customer_unit_id,
        user_id: user.id,
        audit_items: {
          ...audit,
          user_id: user.id
        }
      };

      this.crudService.Save(newAudit, this.data.new, "/audits", newAudit.audit_id).subscribe(res => {
        if (this.notify) {
          this.snackBar.open("Audit saved successfully", "", { duration: 3000 });
          this.notifyResponsibles(datas.map(d => d.area_aspect_id), [
            {
              label: 'Ordem prática',
              desc: this.pratics.find(p => p.id === audit.audit_practical_order_id).audit_practical_order_desc
            },
            {
              label: 'Conformidade',
              desc: this.conforms.find(c => c.id === audit.audit_conformity_id).audit_conformity_desc
            },
            {
              label: 'Evidência de cumprimento',
              desc: audit.audit_evidnece_compliance
            },
            {
              label: 'Ação de controle',
              desc: audit.audit_control_action
            }
          ]).then(res => {
            const data = res.body;
            if (data.success === true) {
              this.snackBar.open("Notification has been sent to Responsibles successfully", "", { duration: 3000 });
              this.loader.close();
              this.dialogRef.close("OK");
            } else {
              this.loader.close();
              this.snackBar.open("Error in sending notification to Responsibles: " + data.error, "", { duration: 7000 });
              this.dialogRef.close("OK");
            }
            
          }).catch(err => {
            this.loader.close();
            this.snackBar.open("Error in sending notification to Responsibles: " + err, "", { duration: 5000 });
            this.dialogRef.close("NOK");
          })
        } else {
          this.loader.close();
          this.dialogRef.close("OK");
        }
      }, err => {
        this.loader.close();
        this.snackBar.open("Error in saving Audit: " + err, "", { duration: 5000 });
        this.dialogRef.close("NOK");
      });
    }); 
          
    
  }

  getAudits(record: any) {
    let params: any = [];    
    params.item_area_aspect_id = record.map(d => d.item_area_aspect_id);
    params.customer_unit_id = record.map(d => d.customer_unit_id);

    this.crudService.GetParams(params, "/audits").subscribe(res => {     
    })
  }

  // notifyResponsibles(aspects: any, auditInfo: any) {
  //   this.crudService.Save({ aspects, auditInformation: auditInfo }, true, "/audits/responsibles/notify", null).subscribe(res => {
  //     this.snackBar.open("Notification has been sent to Responsibles successfully", "", { duration: 3000 });
  //   }, err => {
  //     this.loader.close();
  //     this.snackBar.open("Error in sending notification to Responsibles: " + err, "", { duration: 5000 });
  //   })
  // }

  notifyResponsibles(aspects: any, auditInfo: any) {
    return this.crudService.Save({ aspects, auditInformation: auditInfo }, true, "/audits/responsibles/notify", null).toPromise()
  }

  checkNotify() {
    this.notify = !this.notify;
  }

  getHistorical(record: any) {
    return new Promise((resolve) => {
      if (record.length === 1) {
        resolve(this.crudService.GetParams({
          item_area_aspect_id: record[0].item_area_aspect_id,
          customer_unit_id: record[0].customer_unit_id
        }, "/audits/historicals").toPromise());
      } else {
        resolve(null);
      }
    })
  }

  getPraticName(id) {
    let v = this.pratics.find(p => p.audit_practical_order_id === id);
    if (v)
      return v.audit_practical_order_desc;
  }

  getConformityName(id) {
    let c = this.conforms.find(c => c.audit_conformity_id === id);
    if (c)
      return c.audit_conformity_desc;
  }

  loadPraticalOrder() {
    return this.crudService.GetParams(undefined, "/praticalorder").toPromise().then(res => res.body);
  }

  loadConformity() {
    return this.crudService.GetParams(undefined, "/conformity").toPromise().then(res => res.body);
  }

}
