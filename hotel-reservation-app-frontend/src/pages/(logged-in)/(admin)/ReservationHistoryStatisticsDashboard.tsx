import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../../hooks/useAuth';
import { getReservationHistoryStatistics } from '../../../services/api/ReservationRequests';
import { ReservationHistoryStatisticsModel } from '../../../types/ReservationHistoryStatisticsModel';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const ReservationHistoryStatisticsDashboard: React.FC = () => {
    const monthNames = [
     'January', 'February', 'March', 'April', 'May', 'June',
     'July', 'August', 'September', 'October', 'November', 'December'
    ];

  const { auth } = useAuth();
  const [statistics, setStatistics] = useState<ReservationHistoryStatisticsModel[]>([]);
  const [filteredStatistics, setFilteredStatistics] = useState<ReservationHistoryStatisticsModel[]>([]);
  const [year, setYear] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [roomNumber, setRoomNumber] = useState<string>('');
  const [roomType, setRoomType] = useState<string>('');

  // Unique filter options
  const [yearOptions, setYearOptions] = useState<number[]>([]);
  const [monthOptions, setMonthOptions] = useState<number[]>([]);
  const [roomNumberOptions, setRoomNumberOptions] = useState<number[]>([]);
  const [roomTypeOptions, setRoomTypeOptions] = useState<string[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatistics = async () => {
      if (auth && auth.token) {
        const data = await getReservationHistoryStatistics(auth.token);
        setStatistics(data);
        setFilteredStatistics(data);

        // Generate unique options for filters
        const years = Array.from(new Set(data.map(stat => new Date(stat.startDate).getFullYear())));
        const months = Array.from(new Set(data.map(stat => (new Date(stat.startDate).getMonth() + 1)))); // Months are 0-indexed
        const roomNumbers = Array.from(new Set(data.map(stat => stat.roomNumber)));
        const roomTypes = Array.from(new Set(data.map(stat => stat.roomType)));

        setYearOptions(years.sort((n1, n2) => n1 - n2));
        setMonthOptions(months.sort((n1, n2) => n1 - n2));
        setRoomNumberOptions(roomNumbers.sort((n1, n2) => n1 - n2));
        setRoomTypeOptions(roomTypes);
      }
    };

    fetchStatistics();
  }, [auth]);

  const handleFilter = () => {
    let filtered = statistics;

    if (year) {
      filtered = filtered.filter(stat => new Date(stat.startDate).getFullYear().toString() === year);
    }

    if (month) {
      filtered = filtered.filter(stat => (new Date(stat.startDate).getMonth() + 1).toString() === month);
    }

    if (roomNumber) {
      filtered = filtered.filter(stat => stat.roomNumber.toString() === roomNumber);
    }

    if (roomType) {
      filtered = filtered.filter(stat => stat.roomType === roomType);
    }

    setFilteredStatistics(filtered);
  };

  const generateChartData = () => {
    const roomTypeCountByMonth: { [month: number]: { [roomType: string]: number } } = {};

    const aggregateData = (data: ReservationHistoryStatisticsModel[]) => {
      data.forEach(stat => {
        const month = new Date(stat.startDate).getMonth() + 1; // Months are 0-indexed
        const roomType = stat.roomType;

        if (!roomTypeCountByMonth[month]) {
          roomTypeCountByMonth[month] = { 'Single': 0, 'Double': 0, 'Suite': 0 };
        }

        if (roomTypeCountByMonth[month][roomType] !== undefined) {
          roomTypeCountByMonth[month][roomType] += 1;
        }
      });
    };

    if (year || month || roomNumber || roomType) {
      aggregateData(filteredStatistics);
    } else {
      aggregateData(statistics);
    }

    return {
      labels: Array.from({ length: 12 }, (_, i) => new Date(2024, i).toLocaleString('en-GB', { month: 'short' })),
      datasets: [
        {
          label: 'Single',
          backgroundColor: '#6ED3FF',
          barThickness: 40,
          categoryPercentage: 1,
          data: Array.from({ length: 12 }, (_, i) => roomTypeCountByMonth[i + 1]?.['Single'] || 0),
        },
        {
          label: 'Double',
          backgroundColor: '#1497FF',
          barThickness: 40,
          categoryPercentage: 1,
          data: Array.from({ length: 12 }, (_, i) => roomTypeCountByMonth[i + 1]?.['Double'] || 0),
        },
        {
          label: 'Suite',
          backgroundColor: '#FF6F61',
          barThickness: 40,
          categoryPercentage: 1,
          data: Array.from({ length: 12 }, (_, i) => roomTypeCountByMonth[i + 1]?.['Suite'] || 0),
        }
      ]
    };
  };

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
        ticks: {
          padding: 5
        },
        grid: {
          display: false
        }
      },
      y: {
        stacked: true,
        grid: {
            //@ts-ignore
          drawBorder: false
        },
        ticks: {
            //@ts-ignore
          beginAtZero: true,
          maxTicksLimit: 6,
          padding: 20,
          callback(value) {
            if (typeof value === 'number') {
              if (value < 1e3) return value;
              if (value >= 1e3) return +(value / 1e3).toFixed(1) + 'K';
            }
            return value;
          }
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'right',
        align: 'start',
        labels: {
          usePointStyle: true
        }
      },
      title: {
        display: true,
        text: 'Number of Reservations by Month and Room Type',
      }
    },
    layout: {
      padding: {
        top: 30,
        right: 40,
        bottom: 40
      }
    }
  };

  function handleHistoryClick(): void {
        navigate("/admin/reservations/history")
    }

    function handleCurrentReservationsClick(): void {
        navigate("/admin/reservations")
    }

  return (
    <Container className="mt-5">
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <Button style={{maxHeight: '40px'}} variant="secondary" onClick={handleHistoryClick}><FaArrowLeft/>  Reservations history</Button>
        <h1 className="mb-4">Reservation History Statistics</h1>
        <Button style={{maxHeight: '40px'}} variant="secondary" onClick={handleCurrentReservationsClick}>Current reservations  <FaArrowRight/></Button>
      </div>
      <Row className="mb-4">
        <Col>
          <Form.Select value={year} onChange={(e) => setYear(e.target.value)} aria-label="Select Year">
            <option value="">All years</option>
            {yearOptions.map((yearOption, index) => (
              <option key={index} value={yearOption}>{yearOption}</option>
            ))}
          </Form.Select>
        </Col>
        <Col>
          <Form.Select value={month} onChange={(e) => setMonth(e.target.value)} aria-label="Select Month">
            <option value="">All moths</option>
            {monthOptions.map((monthOption, index) => (
              <option key={index} value={monthOption}>
                {monthNames[monthOption - 1]} 
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col>
          <Form.Select value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} aria-label="Select Room Number">
            <option value="">All rooms</option>
            {roomNumberOptions.map((roomNumberOption, index) => (
              <option key={index} value={roomNumberOption}>{roomNumberOption}</option>
            ))}
          </Form.Select>
        </Col>
        <Col>
          <Form.Select value={roomType} onChange={(e) => setRoomType(e.target.value)} aria-label="Select Room Type">
            <option value="">Every Room Type</option>
            {roomTypeOptions.map((roomTypeOption, index) => (
              <option key={index} value={roomTypeOption}>{roomTypeOption}</option>
            ))}
          </Form.Select>
        </Col>
        <Col>
          <Button variant="primary" onClick={handleFilter}>Filter</Button>
        </Col>
      </Row>

      <Bar
        data={generateChartData()}
        options={chartOptions}
      />
    </Container>
  );
};

export default ReservationHistoryStatisticsDashboard;
