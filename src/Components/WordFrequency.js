import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import './WordFrequency.css';

const WordFrequency = () => {
  const [histogramData, setHistogramData] = useState([]);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    Chart.register(CategoryScale, LinearScale, BarElement, Title);
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://www.terriblytinytales.com/test.txt');
      const text = await response.text();

      const wordFrequencies = {};
      const words = text.split(/[ ,."'\n]+/);
      words.forEach((word) => {
        if (wordFrequencies[word]) {
          wordFrequencies[word]++;
        } else {
          wordFrequencies[word] = 1;
        }
      });

      const sortedWordFrequencies = Object.entries(wordFrequencies)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20);

      setHistogramData(sortedWordFrequencies.map(([word, frequency]) => ({ word, frequency })));
      setShowChart(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const exportToCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' + histogramData.map((item) => `${item.word},${item.frequency}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'histogram-data.csv');
    document.body.appendChild(link);
    link.click();
  };

  const generateChartData = () => {
    const labels = histogramData.map((item) => item.word);
    const data = histogramData.map((item) => item.frequency);

    return {
      labels,
      datasets: [
        {
          label: 'Word Frequency',
          data,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(75, 192, 192, 0.8)',
          hoverBorderColor: 'rgba(75, 192, 192, 1)',
        },
      ],
    };
  };

  const options = {
    scales: {
      x: {
        type: 'category',
        grid: {
          color: 'rgba(255, 255, 255, 0.1)', 
        },
        ticks: {
          color: 'white', 
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)', 
        },
        ticks: {
          color: 'white', 
        },
      },
    },
  };

  const handleBack = () => {
    setShowChart(false);
  };

  return (
    <div>
      {!showChart && (
        <button className="submit-button" onClick={fetchData}>
          <span>Submit</span>
        </button>
      )}

      {showChart && (
        <>
          <Bar data={generateChartData()} options={options} />
    <table className="word-frequency-table">
      <thead>
        <tr>
          <th>Word</th>
          <th>Frequency</th>
        </tr>
      </thead>
      <tbody>
        {histogramData.map(({ word, frequency }) => (
          <tr key={word}>
            <td>{word}</td>
            <td>{frequency}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <button className="export-button" onClick={exportToCSV}>
      <span>Export</span>
    </button>
    <button className="back-button" onClick={handleBack}>
      <span>Back</span>
    </button>
        </>
      )}
    </div>
  );
};

export default WordFrequency;