import { useEffect, useState } from "react";

import participantsData from "./Data";

interface Participant {
  slNo: number;
  name: string;
  accountNo: string;
  token: number;
}

export default function LuckyDraw() {
  const [winner, setWinner] = useState<Participant | null>(null);
  const [winners, setWinners] = useState<Participant[]>([]);
  const [bumperWinners, setBumperWinners] = useState<Participant[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    fetch("/data.json")
      .then((response) => response.json())
      .then((jsonData) => setParticipants(jsonData))
      .catch((error) => console.error("Error loading JSON:", error));
  }, []);

  const drawWinner = () => {
    const randomIndex = Math.floor(Math.random() * participants.length);
    setWinner(participants[randomIndex]);
    console.log(participants[randomIndex].slNo);

    if (bumperWinners.length < 3) {
      const bumpersArray = bumperWinners;
      bumpersArray.push(participants[randomIndex]);
      setBumperWinners(bumpersArray);
    } else {
      const winnersArray = winners;
      winnersArray.push(participants[randomIndex]);
      setWinners(winnersArray);
    }

    // TODO: Ensure winner is removed from the participants list
    setParticipants(
      participants.filter(
        (participant) => participant.token !== participants[randomIndex].token
      )
    );
    console.log(participants);
  };

  // TODO: Cosmetic - Have a Spin Wheel or a Ticker/Counter
  // TODO: for 1-3, display bumper prize
  // TODO: Hide/Show Bumper Prize Winners
  return (
    <div className="container text-center mt-1">
      <h1 className="font-bold">Lucky Draw - Fixed Deposit</h1>
      <button onClick={drawWinner} className="btn btn-primary my-4">
        Draw Winner
      </button>
      <div className="row">
        <button
          className="btn btn-primary"
          data-bs-toggle="collapse"
          data-bs-target="#toggleDiv"
        >
          Display Bumper Prize Winners
        </button>
      </div>

      <div id="toggleDiv" className="row collapse mt-3">
        {bumperWinners.map((winner, index) => (
          <div key={winner.token} className="col-md-4 mb-3">
            <div className="card mt-2" style={{ width: "18rem" }}>
              <div className="card-body">
                <h2 className="card-title">
                  {index <= 2 ? "Bumper Prize" : ""} {index + 1}
                </h2>
                <p className="card-text text-danger font-bold">
                  Name: {winner.name}
                </p>
                <p className="card-text">Account No: {winner.accountNo}</p>
                <p className="card-text text-danger font-bold">
                  Winning Token: {winner.token}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row ">
        {winners.map((winner, index) => (
          <div key={winner.token} className="col-md-4 mb-3">
            <div className="card mt-2" style={{ width: "18rem" }}>
              <div className="card-body">
                <h2 className="card-title"> {index + 4}</h2>
                <p className="card-text text-danger font-bold">
                  Name: {winner.name}
                </p>
                <p className="card-text">Account No: {winner.accountNo}</p>
                <p className="card-text text-danger font-bold">
                  Winning Token: {winner.token}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// const loadData = async () => {
//   const filePath = 'data.csv'; // Path to your CSV file

//   try {
//     // Convert CSV to array of objects
//     const data = await convertCsvToArray(filePath);
//     setParticipants(data);
//     console.log('CSV data as array of objects:', data);
//   } catch (err) {
//     console.error(err);
//   }
// }

// useEffect(()=> {
//   loadData();
// },[])
