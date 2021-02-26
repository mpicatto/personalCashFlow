import React, { PureComponent } from 'react'
import Chart from "chart.js";
import classes from "./balanceChart.css";
import { green, grey } from '@material-ui/core/colors';

Chart.defaults.global.defaultFontFamily = "'PT Sans', sans-serif"
// Chart.defaults.global.legend.display = true;
// Chart.defaults.global.elements.line.tension = 0;

export default class LineGraph extends PureComponent {
    chartRef = React.createRef();

    newChart={}
    minValue=0

    componentDidMount() {

        this.buildChart();
    }

    componentDidUpdate() {
        this.newChart.destroy()

        this.buildChart();
    }


    
    buildChart = () => {
        const myChartRef = this.chartRef.current.getContext("2d");
        const { data,labels} = this.props;
        let type1={
                label: "Saldo ($)",
                data: data,
                yAxisID:'A',
                type:"line",
                fill:false,
                borderColor: green[400],
                backgroundColor:green[400],
                
            }
           
        
       this.newChart= new Chart(myChartRef, {
            
            data: {
                //Bring in data
                labels: labels.length === data.length ? labels : new Array(data.length).fill("Data"),
                datasets: [
                    {
                        label:type1.label,
                        data: type1.data,
                        yAxisID:type1.yAxisID,
                        fill: type1.fill,
                        type:type1.type,
                        borderColor:type1.borderColor,
                        backgroundColor:type1.backgroundColor,
                        pointRadius: 5
                    },

                ]
            },
            options: {
                //Customize chart options
                responsive: true,
                maintainAspectRatio: false,

                layout: {
                    padding: {
                        top: 5,
                        left: 15,
                        right: 15,
                        bottom: 5
                    }
                },
                scales: {
                    xAxes: [{
                        gridLines: {
                            display: true,
                            drawBorder: false,
                            offsetGridLines: true
                        },
                    }],
                    yAxes: [{
                        id:type1.yAxisID,
                        scaleLabel:{display:true, labelString:type1.label},

                        gridLines: {
                            display: true,
                            drawBorder: true
                        }
                    
                    }],
                    
                }
              }
        });
    }
    render() {
        return (
            <div className={classes.graphContainer} >
                <canvas 
                    id="myChart"
                    ref={this.chartRef}
                    height='300'
                />
            </div>
        )
    }
}