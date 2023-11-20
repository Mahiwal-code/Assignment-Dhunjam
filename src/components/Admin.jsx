import { Chart, LinearScale, CategoryScale } from "chart.js"; // Import LinearScale and CategoryScale
import { useState, useEffect, useRef } from "react";
import { registerables } from "chart.js";
Chart.register(...registerables);

const AdminDashboard = ({ id }) => {
  const [chargeCustomers, setChargeCustomers] = useState(false);
  const [customSongAmount, setCustomSongAmount] = useState(99);
  const [regularSongAmounts, setRegularSongAmounts] = useState([
    79, 59, 39, 19,
  ]);
  const [outletName, setOutletName] = useState("");
  const [isSaveEnabled, setSaveEnabled] = useState(false);

  useEffect(() => {
    // Update save button status based on conditions
    if (chargeCustomers) {
      setSaveEnabled(
        customSongAmount > 99 &&
          regularSongAmounts.every((amount) => amount > 0)
      );
    } else {
      setSaveEnabled(false);
    }
  }, [chargeCustomers, customSongAmount, regularSongAmounts]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://stg.dhunjam.in/account/admin/${id !== -1 ? id : 1}`
        );

        if (response.ok) {
          const data = await response.json();

          // Update state based on the API response
          setChargeCustomers(data.data.charge_customers);
          setCustomSongAmount(data.data.amount.category_6);
          setRegularSongAmounts([
            data.data.amount.category_7,
            data.data.amount.category_8,
            data.data.amount.category_9,
            data.data.amount.category_10,
          ]);
          setOutletName(data.data.name);
        } else {
          console.error("Failed to fetch admin details");
        }
      } catch (error) {
        console.error("An error occurred while fetching admin details:", error);
      }
    };

    fetchData();
  }, [id]);

  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    const data = {
      labels: [
        "Custom Amount",
        "Category 7",
        "Category 8",
        "Category 9",
        "Category 10",
      ],
      datasets: [
        {
          label: "Currency Value",
          data: [customSongAmount, ...regularSongAmounts],
          backgroundColor: "#F0C3F1",
        },
      ],
    };

    const options = {
      scales: {
        y: {
          // type: "linear", // Use linear scale
          beginAtZero: true,
        },
        x: {
          type: "category", // Use category scale
          labels: [
            "Custom Amount",
            "Category 7",
            "Category 8",
            "Category 9",
            "Category 10",
          ],
        },
      },
    };

    let myChart = new Chart(ctx, {
      type: "bar",
      data: data,
      options: options,
      plugins: [LinearScale, CategoryScale], // Add the scales as plugins
    });

    // Cleanup the chart when the component is unmounted
    return () => {
      myChart.destroy();
    };
  }, [customSongAmount, regularSongAmounts]);

  const handleChargeCustomersChange = (value) => {
    setChargeCustomers(value);
  };

  const handleCustomSongAmountChange = (e) => {
    setCustomSongAmount(parseInt(e.target.value, 10) || 0);
  };

  const handleRegularSongAmountChange = (index, e) => {
    const newAmounts = [...regularSongAmounts];
    newAmounts[index] = parseInt(e.target.value, 10) || 0;
    setRegularSongAmounts(newAmounts);
  };

  const handleSave = () => {
    console.log("Data saved:", {
      chargeCustomers,
      customSongAmount,
      regularSongAmounts,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-10">
      <div className="p-4">
        <h1 className="mb-8 text-[32px] font-bold">{outletName}</h1>
        <div className="mb-4">
          <p className="flex items-center text-[16px] gap-x-4">
            Do you want to charge your <br />
            customers for requesting songs?
            <span className="ml-2">
              <label className="ml-2 ">
                <input
                  className="bg-[C2C2C2]"
                  type="radio"
                  value="true"
                  checked={chargeCustomers}
                  onChange={() => handleChargeCustomersChange(true)}
                />
                Yes
              </label>
              <label className="ml-2">
                <input
                  type="radio"
                  value="false"
                  checked={!chargeCustomers}
                  onChange={() => handleChargeCustomersChange(false)}
                />
                No
              </label>
            </span>
          </p>
        </div>

        {chargeCustomers && (
          <div>
            <div className="mb-4 flex">
              <p className="flex items-center gap-x-8">
                <span className="mr-2 text-[16px]">
                  Custom song request amount-
                </span>
                <span className="ml-auto flex items-center">
                  <input
                    type="number"
                    value={customSongAmount}
                    onChange={handleCustomSongAmountChange}
                    min={99}
                    className="ml-2 p-2 border rounded-xl w-11/12 text-center text-white bg-black"
                  />
                </span>
              </p>
            </div>

            <div className="mb-4 flex gap-x-8">
              <p className="">
                Regular song request amounts,
                <br /> from high to low-
              </p>
              <div>
                {regularSongAmounts.map((amount, index) => (
                  <input
                    key={index}
                    type="number"
                    value={amount}
                    onChange={(e) => handleRegularSongAmountChange(index, e)}
                    min={index * 20 + 19}
                    className="ml-2 p-2 border rounded-xl w-12 text-center text-white bg-black"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mb-8 w-1/2">
        <canvas id="myChart" className="w-full h-1/2" ref={canvasRef}></canvas>
      </div>

      <div className="text-center mt-4 ">
        <button
          onClick={handleSave}
          disabled={!isSaveEnabled}
          className="p-2 bg-[#6741D9] text-white rounded-xl w-[600px] "
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
