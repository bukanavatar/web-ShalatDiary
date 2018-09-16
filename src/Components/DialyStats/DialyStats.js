import React, {Component} from 'react'
import {Container} from 'reactstrap';
import {defaults, Line} from 'react-chartjs-2';
import firebase from '../../Firebase';

class DialyStats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataShalat: {}
        }
    }

    componentDidMount() {
        const db = firebase.firestore();
        const settings = {timestampsInSnapshots: true};
        db.settings(settings);
        const pathname = this.props.location.pathname;
        const userId = pathname.split("/")[2];
        const tanggal = pathname.split("/")[3];
        db.collection('users').doc(userId).collection('tanggal').doc(tanggal).get()
            .then(doc => {
                if (!doc.exists) {
                    console.log("Not Found")
                } else {
                    this.setState({
                        dataShalat: doc.data()
                    });
                }
            }).then(() => {
            console.log(this.state.dataShalat.Subuh);
        })
    }

    render() {
        const {dataShalat} = this.state;
        if (!dataShalat.Subuh) {
            return (
                <div>Loading...</div>
            )
        } else {
            let dataBerat;
            dataBerat = [dataShalat.Subuh.value, dataShalat.Dzuhur.value, dataShalat.Ashar.value, dataShalat.Maghrib.value, dataShalat.Isya.value];
            // dataBerat = [0, 20, 40, 20, 80];

            const yLabels = {
                0: 'Belum Diisi',
                20: 'Tidak Shalat',
                40: 'Telat',
                60: 'Sendri',
                80: 'Jamaah'
            };
            const options = {
                maintainAspectRatio: true,
                stacked: false,
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                elements: {
                    line: {
                        tension: 0
                    }
                },
                scales: {
                    yAxes: [{
                        type: 'linear',
                        display: true,
                        position: 'left',
                        id: 'A',
                        ticks: {
                            beginAtZero: true,
                            callback: (value, index, values) => {
                                return yLabels[value]
                            },
                            min: 0,
                            max: 80,
                            stepSize: 20
                        }
                    }]
                },
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 40,
                        bottom: 0
                    }
                }
            };
            const data = (canvas) => {
                const ctx = canvas.getContext("2d");
                const gradient = ctx.createLinearGradient(0, 500, 0, 0);
                defaults.global.tooltips.enabled = false;
                defaults.global.animation = {
                    duration: 300,
                    easing: 'easeInQuad'
                };
                return {
                    labels: ['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'],
                    datasets: [
                        {
                            label: 'Status Shalat',
                            yAxesID: 'A',
                            data: dataBerat,
                            backgroundColor: gradient,
                            borderColor: '#0aa1ff'
                        }
                    ]
                }
            };

            return (
                <Container>
                    <h1>Statistik Harian Shalat</h1>
                    <Line data={data} height={140} options={options}/>
                </Container>
            );
        }
    }
}

export default DialyStats;