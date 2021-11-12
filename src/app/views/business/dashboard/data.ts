const chart1 = {
    title: "AVALIAÇÃO DE CONFORMIDADE LEGAL DOS REQUISITOS DE ORDEM PRÁTICA",
    options: {
        chart: {
            type: 'column',
        },
        xAxis: {
            categories: ['CONFORME 1316', 'NAO CONFORME 26', 'FARCIAL 0']
        },
        yAxis: {
            title: ""
        },
        legend: {
            enabled: true,
            verticalAlign: "top",
            layout: 'vertical',
            align: 'right',      
            width: '10%'
        },
        series: [
            {
                name: "",
                data: [{ y: 99, color: '#218e23' }, { y: 4, color: '#ff0100' }, { y: 0, color: '#ff0100' }]
            }
        ],     
    }
};

const chart2 = {
    title: "NÃO CONFORMIDADE POR ÁREAS",
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
                { y: 6, color: "#3466cb", name: "ALINE HATANO" },
                { y: 65.4, color: "#dc3911", name: "CELIO SANTOS" },
                { y: 19.2, color: "#ff9900", name: "FERNANDO NERO HELENA FERRAZ" },
                { y: 9, color: "#0c9618", name: "FERNANDO NERO" },
                { y: 5, color: "#990199", name: "GUILHERME FORTUNATO" },
            ],
            size: '100%',
            innerSize: '40%',
        }],   
    }
}

const chart3 = {
    title: "REQUISITOS LEGAIS TOTAIS POR ÁREA",
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
                { y: 6, color: "#3466cb", name: "ALINE HATANO" },
                { y: 65.4, color: "#dc3911", name: "APARECIDA SILVA" },
                { y: 19.2, color: "#ff9900", name: "BARTOLUCIO SILVA" },
                { y: 9, color: "#0c9618", name: "CARLA PERES" },
                { y: 5, color: "#0099c6", name: "CELIO SANTOS" },
                { y: 5, color: "#dd4477", name: "CLECIO SILVA" },
                { y: 5, color: "#b82e2e", name: "DAVID FERNANDES" },
                { y: 5, color: "#326395", name: "EDSON NOGUEIRA" },
                { y: 5, color: "#20ab99", name: "FERNANDO NERO GUILHERME FORTUNATO HELENA FERRAZ" },
                { y: 5, color: "#ffffff", name: "FERNANDO NERO HELENA FERRAZ" },
                { y: 5, color: "#ffffff", name: "FERNANDO NERO" },
                { y: 5, color: "#aaaa10", name: "GEORGIA ROSSI" },
                { y: 5, color: "#ffffff", name: "GUILHERME SPRENGEL" },
                { y: 5, color: "#6633cb", name: "JULIANO ALMEIDA" },
                { y: 5, color: "#e67301", name: "LOGISTICA REGIONAL" },
                { y: 5, color: "#640f66", name: "LUCIANA MACHADO" },
                { y: 5, color: "#5474a6", name: "MEIRE BLUMEN" },
                { y: 5, color: "#0ed71e", name: "PATRICIA BERTAGNI" },
                { y: 5, color: "#b91483", name: "ROBERTA PEREIRA" },
                { y: 5, color: "#f5369d", name: "OTHER" },
            ],
            size: '100%',
            innerSize: 0,
        }],   
    }
}

const chart4 = {
    title: "RELATÓRIO DE NÃO CONFORMIDADES POR ASPECTO",
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
                { y: 5, color: "#3466cb", name: "ARMAZENAMENTO DE RESIDUO SOLIDO" },
                { y: 7.7, color: "#dc3911", name: "CADASTRO DE GRANDE GERADOR DE RESIDUO" },
                { y: 5, color: "#ff9900", name: "RESIDUO SOLIDO" },
                { y: 11.5, color: "#0c9618", name: "REUSO DE AGUA" },
                { y: 65.4, color: "#990199", name: "RUIDO" },
                { y: 5, color: "#f0f0f0", name: "TRANSPORTE TERRESTRE DE PRODUTOS PERIGOSOS - DOCUMENTACAO" },
                { y: 5, color: "#da4376", name: "TRANSPORTE TERRESTRE DE PRODUTOS PERIGOSOS - EMBALAGENS VAZIAS E NAO LIMPAS" },
            ],
            size: '100%',
            innerSize: 0,
        }],   
    }
}
export {
    chart1, chart2, chart3, chart4
}

  