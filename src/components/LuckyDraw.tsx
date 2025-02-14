import { useEffect, useState } from "react";

interface Participant {
  slNo: number;
  name: string;
  accountNo: string;
  token: number;
}

// TODO: Cosmetic - Have a Spin Wheel or a Ticker/Counter
// TODO: Show bumper winners in modal (too complicated to implement)

export default function LuckyDraw() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  let [drawCount, setDrawCount] = useState<number>(0);

  const [winner, setWinner] = useState<Participant | null>(null);
  // const [bumperWinner1, setBumperWinner1] = useState<Participant | null>(null);
  // const [bumperWinner2, setBumperWinner2] = useState<Participant | null>(null);
  // const [bumperWinner3, setBumperWinner3] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(false);
  const [winners, setWinners] = useState<Participant[]>([]);
  const [bumperWinners, setBumperWinners] = useState<Participant[]>([]);
  let [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("/data.json")
      .then((response) => response.json())
      .then((jsonData) => setParticipants(jsonData))
      .catch((error) => console.error("Error loading JSON:", error));
  }, []);

  const drawWinner = () => {
    if (drawCount >= 20) return;
    setLoading(true); // Show spinner

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * participants.length);
      setWinner(participants[randomIndex]);
      setDrawCount(++drawCount);

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
      setLoading(false); // Hide spinner
    }, 8000); // Simulate suspense (3 seconds)

    console.log(participants);
  };

  return (
    <div className="container text-center mt-1">
      {/* Marquee Section */}
      <div className="marquee-container">
        <div className="marquee">
          {[...participants].map((participant, index) => (
            <span key={index} className="marquee-item">
              {participant.token}
            </span>
          ))}
        </div>
      </div>
      <button
        onClick={drawWinner}
        className="btn btn-danger my-4 btn-lg fs-2 p-4"
      >
        Draw Winner
      </button>

      {/* Display Spinner while loading */}

      {loading && (
        <div className="row d-flex justify-content-center">
          <div className="text-center mt-3" role="status">
            {/* <span className="visually-hidden">Loading...</span> */}
            <img src="/spin-wheel.webp" alt="Spin Wheel" />
          </div>
        </div>
      )}

      {/* Bootstrap Modal for Winner */}
      <div
        className={`modal fade ${showModal ? "show d-block" : "d-none"}`}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg modal-custom">
          <div className="modal-content fs-1">
            <div className="modal-header">
              <h5 className="modal-title">🎉 Lucky Winner 🎉</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            <div className="modal-body vh-200">
              <h2 className="text-center fs-1 my-5">
                Token:&nbsp;
                <span className="text-danger fs-1">
                  {winner?.token || "???"}
                </span>
              </h2>
              <h2 className="text-center fs-1">
                Name:&nbsp;
                <span className="text-info">{winner?.name || "???"}</span>
              </h2>
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

      {/* Bumper Prize Winners */}

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
        <table className="table table-striped table-hover fs-3">
          <thead className="table-primary">
            <tr>
              <th scope="col">Prize#</th>
              <th scope="col">Name</th>
              <th scope="col">Ghina A/c No</th>
              <th scope="col">Token No</th>
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
