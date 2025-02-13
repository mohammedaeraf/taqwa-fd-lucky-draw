import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import participantsData from "./Data";

interface Participant {
  slNo: string;
  name: string;
  accountNo: string;
  token: string;
}

export default function LuckyDraw() {
  const [winner, setWinner] = useState<Participant | null>(null);
  const [winners, setWinners] = useState<Participant[]>([]);

  const [participants, setParticipants] =
    useState<Participant[]>(participantsData);

  const drawWinner = () => {
    const randomIndex = Math.floor(Math.random() * participants.length);
    setWinner(participants[randomIndex]);
    console.log(participants[randomIndex].slNo);

    const winnersArray = winners;
    winnersArray.push(participants[randomIndex]);
    setWinners(winnersArray);
    setParticipants(
      participants.filter((participant) => participant.slNo !== winner?.slNo)
    );
    console.log(participants);
  };

  return (
    <div className="container text-center mt-1">
      <h1 className="font-bold">Lucky Draw - Fixed Deposit</h1>
      <button onClick={drawWinner} className="btn btn-primary my-4">
        Draw Winner
      </button>
      <div className="row ">
        {winners.map((winner, index) => (
          <div key={winner.token} className="col-md-3 mb-3">
            <div className="card mt-2" style={{ width: "18rem" }}>
              <div className="card-body">
                <h2 className="card-title">{index + 1}</h2>
                <p className="card-text">Name: {winner.name}</p>
                <p className="card-text">Account No: {winner.accountNo}</p>
                <p className="card-text">Winning Token: {winner.token}</p>
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
