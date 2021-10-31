import { Component, OnInit, ViewChild, SimpleChanges } from '@angular/core';
import { getFields } from 'app/helpers/utils.functions';
import { CRUDService } from 'app/services/negocio/CRUDService/CRUDService';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  lastSearch: any;
  generalCompliance: any;



constructor(
  private crud: CRUDService,
) { };


  ngOnInit()
  {
    let data = new Date();
    let ano = data.getFullYear().toString();
    let mes = data.getMonth() + 1;

    let dtIni = ano;
    let dtFim = ano;
    if (mes < 10) {
      dtIni = dtIni + '0' + mes.toString() + '01';
      dtFim = dtFim + '0' + mes.toString() + '31';
    } else {
      dtIni = dtIni + mes.toString() + '01';
      dtFim = dtFim + mes.toString() + '31';
    }

    this.prepareScreen();
  }

  prepareScreen() {
    this.getResponsibleByAspect(undefined);
    this.getResponsibleByConformity(undefined);
    this.getGeneralCompliance(undefined);
  }

  //#region line chart

  lineChartSteppedData: Array <any> = [{
    data: [1, 8, 4, 8, 2, 2, 9, 0, 0, 0, 0, 0],
    label: 'Conformidade',
    borderWidth: 0,
    fill: true,
    // steppedLine: true
  }, {
    data: [6, 2, 9, 3, 8, 2, 1, 0, 0, 0, 0, 0],
    label: 'Não Conformidade',
    borderWidth: 1,
    fill: true,
    // steppedLine: true
    }
  ];

  public lineChartLabels: Array<any> = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  /*
  * Full width Chart Options
  */
  public lineChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false,
      position: 'bottom'
    },
    scales: {
      xAxes: [{
        display: false,
        gridLines: {
          color: 'rgba(0,0,0,0.02)',
          zeroLineColor: 'rgba(0,0,0,0.02)'
        }
      }],
      yAxes: [{
        display: false,
        gridLines: {
          color: 'rgba(0,0,0,0.02)',
          zeroLineColor: 'rgba(0,0,0,0.02)'
        },
        ticks: {
          beginAtZero: true,
          suggestedMax: 9,
        }
      }]
    }
  };

  public lineChartColors: Array<any> = [{
    backgroundColor: 'rgba(63, 81, 181, 0.16)',
    borderColor: 'rgba(0,0,0,0)',
    pointBackgroundColor: 'rgba(63, 81, 181, 0.4)',
    pointBorderColor: 'rgba(0, 0, 0, 0)',
    pointHoverBackgroundColor: 'rgba(63, 81, 181, 1)',
    pointHoverBorderColor: 'rgba(148,159,177,0)'
  }, {
    backgroundColor: 'rgba(0, 0, 0, .08)',
    borderColor: 'rgba(0,0,0,0)',
    pointBackgroundColor: 'rgba(0, 0, 0, 0.06)',
    pointBorderColor: 'rgba(0, 0, 0, 0)',
    pointHoverBackgroundColor: 'rgba(0, 0, 0, 0.1)',
    pointHoverBorderColor: 'rgba(0, 0, 0, 0)'
  }];
  public lineChartLegend: boolean = false;
  public lineChartType: string = 'line';

  //#endregion


  //#region doughnut Chart


  doughnutChartColors1: any[] = [{
    backgroundColor: ['rgba(12, 85, 87, .8)', 'rgba(0, 0, 0, .24)',]
  }];
    doughnutChartColors2: any[] = [{
    backgroundColor: ['rgba(0, 0, 0, .5)', 'rgba(0, 0, 0, .15)',]
  }];
  doughnutChartType = 'doughnut';
  doughnutOptions1: any = {
    cutoutPercentage: 85,
    responsive: true,
    legend: {
      display: false,
      position: 'bottom'
    },
    elements: {
      arc: {
        borderWidth: 0,
      }
    },
    tooltips: {
      enabled: true
    }
  };

  doughnutOptions2: any = {
    cutoutPercentage: 85,
    responsive: true,
    legend: {
      display: false,
      position: 'bottom'
    },
    elements: {
      arc: {
        borderWidth: 0,
      }
    },
    tooltips: {
      enabled: true
    }
  };
  
  doughnutLabels = [];
  doughnutChartData1: number[] = [];// = [this.data1, (this.total1 - this.data1)];

  doughnutChartData2: number[] = [];// = [this.data2, (this.total2 - this.data2)];


  //#endregion


  getGeneralCompliance(parameter: any) {
    let p: any = new Object();
    // p.orderby = "area_name";
    // p.direction = "asc";
    this.lastSearch = p;
    this.crud.GetParams(this.lastSearch, "/dashboard/general_compliance").subscribe(res => {
      this.generalCompliance = res.body
    });
  }

  getResponsibleByConformity(parameter: any) {    
    let p: any = new Object();
    // p.orderby = "area_name";
    // p.direction = "asc";
    this.lastSearch = p;
    this.crud.GetParams(this.lastSearch, "/dashboard/responsible_aspect").subscribe(res => {
      const dados = res.body;
      const labels = getFields(dados, 'unit_aspect_responsible_name');
      const values = getFields(dados, '_count');

      this.doughnutLabels = labels;
      this.doughnutChartData1 = values;
    })
  }

  getResponsibleByAspect(parameter: any) {    
    let p: any = new Object();
    // p.orderby = "area_name";
    // p.direction = "asc";
    this.lastSearch = p;
    return this.crud.GetParams(this.lastSearch, "/dashboard/responsible_conformity").toPromise().then(res => {
      const dados = res.body;
      const labels = getFields(dados, 'unit_aspect_responsible_name');
      const values = getFields(dados, '_count');

      this.doughnutLabels = labels;
      this.doughnutChartData2 = values;
    });
  }
}