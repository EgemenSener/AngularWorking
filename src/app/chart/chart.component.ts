import { Component, AfterViewInit, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';
import { finalize, map } from 'rxjs';
import { FGetEntityExpression } from '../../../../../service-proxies/expressions/FGetEntityExpression';
import { FSearchExpression, QualityServiceProxy } from '../../../../../service-proxies/service-proxies';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements AfterViewInit {

  isBrowser: boolean;
  categoryData: any[] = [];
  public showPieChart = false;
  pieChartInstance: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private qualityService: QualityServiceProxy
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    Chart.register(...registerables);
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.getCategoryData();
    }
  }

  getCategoryData(): void {
    const searchParam: FGetEntityExpression = new FGetEntityExpression();
    const fseachParm1: FSearchExpression = new FSearchExpression();
    searchParam.skipCount = 0
    searchParam.orderBy = "plannedQty desc"
    fseachParm1.propName = "status"
    fseachParm1.searchOperator = 0
    fseachParm1.searchAndOrOperator = 0
    fseachParm1.value1 = "Planlanmis"
    searchParam.searchExpressionList = [fseachParm1]
    // İlk olarak veriyi alıyoruz ve sonra grafikleri güncelliyoruz
    this.qualityService.countOrders(searchParam).pipe(
      finalize(() => { }),
      map((datas: any) => ({
        data: datas.items,
        totalCount: datas.totalCount,
        summary: null,
        groupCount: 0
      }))
    ).toPromise().then((result: any) => {
      this.categoryData = result.data;
      const data = result.data;
      console.log(data);
      const barChart1 = document.getElementById('barCharPlanlanmis') as HTMLCanvasElement;
      const chart = new Chart(barChart1, {
        type: 'bar',
        data: {
          labels: data.map(item => item.itemCode),
          datasets: [{
            label: 'Üretim Siparişleri Sayısı',
            data: data.map(item => item.totalQty),
            borderWidth: 1,
            backgroundColor: 'rgba(179, 31, 36, 0.9)',
            borderColor: '#b31f24',
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          },
          responsive: true,
          onClick: () => {
            barChart1.onclick = (event) => {
              const activePoints = chart.getElementsAtEventForMode(
                event,
                'nearest',
                { intersect: true },
                true
              );

              if (activePoints.length) {
                const dataIndex = activePoints[0].index;
                // categoryData dizisinden o index'e karşılık gelen veriyi alalım
                const clickedData = this.categoryData[dataIndex];
                console.log("Tıklanan Veri:", clickedData);
                this.createOrUpdatePieChart(event, clickedData);
              };
            }
          }
        }
      });
    });
  }

  createOrUpdatePieChart(event: any, clickedData: any): void {
    const pieChart1 = document.getElementById('pieChart1') as HTMLCanvasElement;
    if (!this.showPieChart) {
      this.pieChartInstance = new Chart(pieChart1, {
        type: 'pie',
        data: {
          labels: clickedData.companies.map(item => item.cardName),
          datasets: [{
            label: 'Şirket Dağılımı',
            data: clickedData.companies.map(item => item.plannedQty),
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)'
            ],
            hoverOffset: 4
          }]
        }
      });
      this.showPieChart = true
    } else {
      this.pieChartInstance.data.labels = clickedData.companies.map(item => item.cardName);
      this.pieChartInstance.data.datasets[0].data = clickedData.companies.map(item => item.plannedQty);
      this.pieChartInstance.update();
    }
  }
}
