import { Box, Button, CircularProgress, createTheme, ThemeProvider } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { HistoricalChart } from '../../api/api'
import { CryptoState } from '../../Context/CryptoContext'

import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Title, Legend,
} from "chart.js";
import { chartDays } from '../../data'
// react-chartjs-2 is just a wrapper, it still relies on ChartJS for the actual charts
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Title, Legend);

const CoinInfo = ({ coin }) => {
  const [historicData, setHistoricData] = useState([])
  const [loading, setLoading] = useState(false)
  const [days, setDays] = useState(1)

  const { currency } = CryptoState()

  const fectchHistoricalData = async () => {
    setLoading(true)
    await fetch(HistoricalChart(coin.id, days, currency))
      .then(res => res.json())
      .then(data => {
        setHistoricData(data?.prices);
      })
    setLoading(false)
  }

  useEffect(() => {
    fectchHistoricalData()
  }, [days])

  // console.log(historicData);


  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      mode: "dark"
    },
  });

  const labels = historicData.map(coin => {
    let date = new Date(coin[0])
    let time = date.getHours() > 12
      ? `${date.getHours() - 12} : ${date.getMinutes()} PM`
      : `${date.getHours()} : ${date.getMinutes()} AM`
    return days === 1 ? time : date.toLocaleDateString()
  });
  const datasets = [
    {
      data: historicData.map(coin => coin[1]),
      label: `Price (Past ${days} Days) in ${currency}`,
      borderColor: "#eebc1d",
    },
  ];

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        padding: "1rem"
      }}>
        {loading ?
          <CircularProgress
            style={{ background: "gold" }}
            size={250}
            thickness={1}
          />
          :
          <Line
            data={{ labels, datasets }}
            options={{ elements: { point: { radius: 1 } } }}
          />}
      </Box>
      <Box px={4} sx={{ display: "flex", justifyContent: "space-between" }}>
        {chartDays.map((item) => (
          <Button
            sx={{ border: "1px solid gold", width: "10vw", "&:hover": { background: "gold" } }}
            style={item.value === days ? { background: "gold", color: "#000" } : { "&:hover": { background: "gold" } }}
            key={item.value}
            onClick={() => { setDays(item.value) }}
          >{item.label}</Button>
        ))}
      </Box>
    </ThemeProvider>
  )
}

export default CoinInfo