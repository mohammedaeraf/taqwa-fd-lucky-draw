import { useEffect, useState } from "react";

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
  const [showModal, setShowModal] = useState(false);

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

    setParticipants(
      participants.filter(
        (participant) => participant.token !== participants[randomIndex].token
      )
    );

    setShowModal(true);
    console.log(participants);
  };

  // TODO: Cosmetic - Have a Spin Wheel or a Ticker/Counter
  // TODO: Hide/Show Bumper Prize Winners individually
  // TODO: Show winners in a modal
  return (
    <div className="container text-center mt-1">
      <button onClick={drawWinner} className="btn btn-primary btn-lg my-4">
        Draw Winner
      </button>
      {/* Bootstrap Modal for Winner */}
      <div
        className={`modal fade ${showModal ? "show d-block" : "d-none"}`}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">🎉 Lucky Winner 🎉</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <h2 className="text-center">Token: {winner?.token || "???"}</h2>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-3">
        {bumperWinners.map((winner, index) => (
          <div key={winner.token} className="col-md-4 mb-3">
            <button
              className="btn btn-primary"
              data-bs-toggle="collapse"
              data-bs-target={`#toggleDiv${index}`}
            >
              Show Bumper Prize {index + 1}
            </button>
            <div
              className="card mt-2 collapse"
              id={`toggleDiv${index}`}
              style={{ width: "18rem" }}
            >
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

      <div className="row">
        <table className="table table-striped table-hover">
          <thead className="table-primary">
            <tr>
              <th scope="col">Prize#</th>
              <th scope="col">Name</th>
              <th scope="col">Ghina Acc/No</th>
              <th scope="col">Token</th>
            </tr>
          </thead>
          <tbody>
            {winners.map((winner, index) => (
              <tr key={winner.token}>
                <td>{index + 4}</td>
                <td>{winner.name}</td>
                <td>{winner.accountNo}</td>
                <td>{winner.token}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
