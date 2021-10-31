import { Component, OnInit, ViewChild, SimpleChanges } from '@angular/core';
import { getFields } from 'app/helpers/utils.functions';
import { CRUDService } from 'app/services/negocio/CRUDService/CRUDService';
import { AuthGuard } from 'app/services/auth/auth.guard';
import { roles } from 'app/models/auth/roles';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  lastSearch: any;
  currentUser: any = {};
  generalCompliance: any;



constructor(
  private crud: CRUDService,
  private auth: AuthGuard,
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
    this.currentUser = this.auth.getUser();

    if (this.currentUser.role !== roles.admin) {
      this.lastSearch = {
        customer_id: this.currentUser.customer_id
      }
    }

    this.getResponsibleByAspect(this.lastSearch);
    this.getResponsibleByConformity(this.lastSearch);
    this.getGeneralCompliance(this.lastSearch);
    this.getCumulativeCompliance
      (this.lastSearch);
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
  total1: number;

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
  total2: number;
  
  doughnutLabels = [];
  doughnutChartData1: number[] = [];// = [this.data1, (this.total1 - this.data1)];

  doughnutChartData2: number[] = [];// = [this.data2, (this.total2 - this.data2)];


  //#endregion
  
  
  getCumulativeCompliance(parameter) {
    this.crud.GetParams(parameter, "/dashboard/cumulative_compliance").subscribe(res => {
      
      // const dados: [] = res.body;
      // dados.forEach(d => {
      //   this.lineChartSteppedData.push({
      //     data: dados.reduce((a, b) => {
      //       a.conformity.
      //     })
      //   }
      //   );
      // });
      return res.body;
    });
  }

  getGeneralCompliance(parameter) {
    this.crud.GetParams(parameter, "/dashboard/general_compliance").subscribe(res => {
      this.generalCompliance = res.body
    });
  }

  getResponsibleByConformity(parameter) {    
    this.crud.GetParams(parameter, "/dashboard/responsible_conformity").subscribe(res => {
      const dados = res.body;
      const labels = getFields(dados, 'unit_aspect_responsible_name', 'SEM RESPONSÁVEL');
      const values = getFields(dados, '_count');

      this.total1 = values.reduce((a, b) => a + b, 0);

      this.doughnutLabels = labels;
      this.doughnutChartData1 = values;
    });
  }

  getResponsibleByAspect(parameter) {    
    return this.crud.GetParams(parameter, "/dashboard/responsible_aspect").subscribe(res => {
      const dados = res.body;
      const labels = getFields(dados, 'unit_aspect_responsible_name', 'SEM RESPONSÁVEL');
      const values = getFields(dados, '_count');

      this.total2 = values.reduce((a, b) => a + b, 0);

      this.doughnutLabels = labels;
      this.doughnutChartData2 = values;
    });
  }
}