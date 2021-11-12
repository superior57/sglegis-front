import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { roles } from 'app/models/auth/roles';
import { Coluna } from 'app/models/base/Coluna';
import { CampoBusca } from 'app/models/base/negocio/CampoBusca';
import { AuthGuard } from 'app/services/auth/auth.guard';
import { CRUDService } from 'app/services/negocio/CRUDService/CRUDService';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  SearchFields: Array<CampoBusca> = [];
  Colunas: Array<Coluna>;

  AuxColunas = [];
  buscarForm: FormGroup;
  public finderPanel: boolean = true;
  public formReady: boolean = false;
  public showFilter: boolean = false;
  currentUser: any;
  
  @ViewChild('buscadorForm') public buscadorForm: ElementRef;
  @ViewChild('txtFinder') public txtFinder: ElementRef;

  chartConfigOptions = {    
  }

  chartTitles: string[] = [
    "AVALIAÇÃO DE CONFORMIDADE LEGAL DOS REQUISITOS DE ORDEM PRÁTICA",
    "NÃO CONFORMIDADE POR ÁREAS",
    "REQUISITOS LEGAIS TOTAIS POR ÁREA",
    "RELATÓRIO DE NÃO CONFORMIDADES POR ASPECTO"
  ]
  chartData: Array<any> = [];
  noFormData: boolean = true;
  
  constructor(
    private crud: CRUDService,
    private auth: AuthGuard
  ) { }

  ngOnInit() {
    this.currentUser = this.auth.getUser();
    this.prepareSearch();
    this.prepareScreen();
  }

  async prepareScreen() {       
    const form = this.buscarForm.value;    
    const params = {
      customer_group_id: form.customer_group_id || null,
      customer_id: form.customer_id || null,
      unit_id: form.customer_unit_id || null,
      area_id: form.area_id || null
    };
    this.noFormData = Object.keys(form).length === 0;

    const chart1 = await this.getDataChart1(params),
          chart2 = await this.getDataChart2(params),
          chart3 = await this.getDataChart3(params),
          chart4 = await this.getDataChart4(params);            

    this.chartData = [
      chart1,
      chart2,
      chart3,
      chart4
    ]
  }

  // Search handls...
  async prepareSearch() {
    this.buscarForm = new FormGroup({});    
    let groups = await this.getGroups();    
    let areas = await this.getAreas();    

    this.SearchFields = [      
      new CampoBusca("customer_group_id", "Grupo", 50, "", "LIST", groups.map(g => ({
        ...g,
        disabled: this.currentUser.role !== roles.admin && g.customer_group_id !== this.currentUser.customer_group_id
      })), "customer_group_name", "customer_group_id"),
      new CampoBusca("customer_id", "Matriz", 50, "", "LIST", [], "customer_business_name", "customer_id"),
      new CampoBusca("customer_unit_id", "Unidade", 50, "", "LIST", [], "customer_unit_name", "customer_unit_id"),
      new CampoBusca("area_id", "Sist.Gestão", 50, "", "LIST", areas, "area_name", "area_id"),
    ];
    
    this.prepareSearchForm();
  }
  prepareSearchForm() {
    this.buscarForm = new FormGroup({});    

    for (let i = 0; i < this.SearchFields.length; i++) {      
      this.buscarForm.addControl(this.SearchFields[i].nomeCampo, new FormControl(
        this.SearchFields[i].tipoCampo === "LIST" && this.SearchFields[i].fieldValue === this.SearchFields[i].nomeCampo ? "" : this.SearchFields[i].fieldValue
      ));
      this.buscarForm.controls[this.SearchFields[i].nomeCampo].valueChanges.subscribe(res => {
        this.handleFilterValueChange( this.SearchFields[i].nomeCampo, res );
      })
    }
    this.AuxColunas = Object.assign([], this.Colunas);
    this.formReady = true;    
  }
  handleFilterValueChange(type: string, value: any) {
    if (type === 'customer_group_id') {
      this.getCustomers(value);      
    }
    if (type === 'customer_id') {
      this.getUnits(value);      
    }
  }
  showFinderToggle() {
    this.finderPanel = !this.finderPanel;
  }  
  showFilters() {
    let ret = false;
    Object.keys(this.buscarForm.controls).forEach(field => {
      let control = this.buscarForm.get(field);
      if (control.value) {
        ret = true;
      }
    });
    return ret;
  }  
  setFinderValue() {    
    for (let i = 0; i < this.SearchFields.length; i++){
      this.SearchFields[i].value = this.buscarForm.controls[this.SearchFields[i].nomeCampo].value;
    }
  }
  clear() {
    this.buscarForm.reset();
    for (var name in this.buscarForm.controls) {
      this.buscarForm.controls[name].setValue("");
    }
    
  }
  toggle(col) {
    col.Visivel = !col.Visivel;
    this.Colunas = this.AuxColunas.filter(c => {
      return c.Visivel === true;
    });
  }
  getValue(field) {
    if (!field || !field.value)
      return;
    if (field.tipoCampo == "LIST")
      return field.lista.find(p => p[field.nomeCampo] == field.value)[field.fieldText]
    else
      return field.value;
  }  
  Search() { 
    this.finderPanel = false;    
    this.showFilter = this.showFilters();
    this.setFinderValue(); 
    
    this.prepareScreen();
  }

  // API calling getters..  
  getGroups() {
    return this.crud.GetParams({ "orderby": "customer_group_name", "direction": "asc" }, "/customergroup").toPromise().then(res => res.body);
  }
  getCustomers(group_id) {        
    if (group_id) {
      let p: any = new Object();
      p.orderby = "customer_business_name";
      p.direction = "asc";
      p.fields = "customer_group_id";
      p.ops = "eq";
      p.values = group_id;
      this.crud.GetParams(p, "/customer/query").subscribe(res => {
        let customers = res.body;
        this.SearchFields[1].lista = customers;        
        // this.syncInit = true;
      });
    } else {
      let p: any = new Object();
      p.orderby = "customer_business_name";
      p.direction = "asc";
      p.field = "customer_group_id"
      
      this.crud.GetParams(p, "/customer").subscribe(res => {
        let customers = res.body;
        this.SearchFields[1].lista = customers;        
        // this.syncInit = true;
      });
    }
  }
  getUnits(customer_id) {
    if (customer_id) {
      let p: any = new Object();
      p.orderby = "customer_unit_name";
      p.direction = "asc";
      p.fields = "customer_id";
      p.ops = "eq";
      p.values = customer_id;
      this.crud.GetParams(p, "/customerunit/query").subscribe(res => {
        let units = res.body;
        this.SearchFields[2].lista = units;        
      });
    } else {
      let p: any = new Object();
      p.orderby = "customer_unit_name";
      p.direction = "asc";
      p.field = "customer_id"
      
      this.crud.GetParams(p, "/customerunit").subscribe(res => {
        let units = res.body;
        this.SearchFields[2].lista = units;    
      });
    }
  }
  getAreas() {
    return this.crud.GetParams({ "orderby": "area_name", "direction": "asc" }, "/area").toPromise().then(res => res.body);
  }

  // get chart data...
  getDataChart1(params: object) {
    const colors = [ "#218e23", "#ff0100", "#ffb219" ];
    return new Promise(async (resolve, reject) => {
      const data: Array<any> = await this.crud.GetParams(params, "/dashboard/pratical_order_compliance").toPromise().then(res => res.body);      
      const chartData = {
        title: this.chartTitles[0],
        options: {
            chart: {
                type: 'column',
            },
            xAxis: {
                categories: [
                  ...data.map(d => d._labels)
                ]
            },
            yAxis: {
                title: ""
            },
            legend: {
                enabled: true,
                verticalAlign: "top",
                layout: 'vertical',
                align: 'right',      
                width: '10%',
                labelFormat: "{name} %"
            },
            tooltip: {
              valueSuffix: '%'
            },
            series: [
                {
                    name: "",
                    data: [
                      ...data.map((d, i) => ({ 
                        y: Number(d._percentage),
                        color: colors[i % colors.length],
                        name: d._labels
                      }))
                    ]
                }
            ],     
        }
      }
      resolve(chartData);
    });    
  }
  getDataChart2(params: object) {
    const colors = [ "#3466cb", "#dc3911", "#ff9900", "#0c9618", "#990199" ];
    return new Promise(async (resolve, reject) => {
      const data: Array<any> = await this.crud.GetParams(params, "/dashboard/responsible_conformity").toPromise().then(res => res.body);      
      const chartData = {
        title: this.chartTitles[1],
        options: {
            chart: {
              type: 'pie'
            },
            tooltip: {
              valueSuffix: '%'
            },
            series: [{
                name: "",
                data: [
                  ...data.map((d, i) => ({ 
                    y: Number(d._percentage),
                    color: colors[i % colors.length],
                    name: d._labels
                  }))
                ],
                size: '100%',
                innerSize: '40%',
            }],   
        }
      }
      resolve(chartData);
    });    
  }
  getDataChart3(params: object) {
    const colors = [ "#3466cb", "#dc3911", "#ff9900", "#0c9618", "#990199" ];
    return new Promise(async (resolve, reject) => {
      const data: Array<any> = await this.crud.GetParams(params, "/dashboard/general_compliance").toPromise().then(res => res.body);      
      const chartData = {
        title: this.chartTitles[2],
        options: {
            chart: {
              type: 'pie',
              options3d: {
                enabled: true,
                alpha: 45
              }
            },
            plotOptions: {
              pie: {
                center: ['50%', '50%'],
                depth: 45,
                dataLabels: {
                  enabled: true,
                  distance: -50,
                  style: {
                    fontWeight: 'bold',
                    color: 'white',
                    textOutline: 0
                  },
                  formatter: function () {
                    return this.y > 10 ? this.y + '%' : null;
                  },
                },
                showInLegend: true
              }
            },
            tooltip: {
              valueSuffix: '%'
            },
            series: [{
                name: "",
                data: [
                  ...data.map((d, i) => ({ 
                    y: Number(d._percentage),
                    color: colors[i % colors.length],
                    name: d._labels
                  }))
                ],
                size: '100%',
                innerSize: 0,
            }],   
        }
      }
      resolve(chartData);
    });    
  }
  getDataChart4(params: object) {
    const colors = [ "#3466cb", "#dc3911", "#ff9900", "#0c9618", "#990199" ];
    return new Promise(async (resolve, reject) => {
      const data: Array<any> = await this.crud.GetParams(params, "/dashboard/responsible_aspect").toPromise().then(res => res.body);      
      const chartData = {
        title: this.chartTitles[3],
        options: {
            chart: {
              type: 'pie',
              options3d: {
                enabled: true,
                alpha: 45
              }
            },
            plotOptions: {
              pie: {
                center: ['50%', '50%'],
                depth: 45,
                dataLabels: {
                  enabled: true,
                  distance: '-30%',
                  style: {
                    fontWeight: 'bold',
                    color: 'white',
                    textOutline: 0
                  },
                  formatter: function () {
                    return this.y > 8 ? this.y + '%' : null;
                  },
                },
                showInLegend: true
              }
            },
            tooltip: {
              valueSuffix: '%'
            },
            series: [{
                name: "",
                data: [
                  ...data.map((d, i) => ({ 
                    y: Number(d._percentage),
                    color: colors[i % colors.length],
                    name: d._labels
                  }))
                ],
                size: '100%',
                innerSize: 0,
            }],   
        }
      }
      resolve(chartData);
    });    
  }

  // chart handlers...  
  public chartClicked(e: any): void {
    console.log(e);
  }
  public chartHovered(e: any): void {
    console.log(e);
  }


}
