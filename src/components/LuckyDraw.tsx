import { useEffect, useState } from "react";

// Defines the structure of a participant in the lucky draw
interface Participant {
  slNo: number;
  name: string;
  accountNo: string;
  token: number;
}

export default function LuckyDraw() {
  // Store all participants loaded from the data.json file
  const [participants, setParticipants] = useState<Participant[]>([]);
  // Track the number of draws performed (limited to 20 total)
  let [drawCount, setDrawCount] = useState<number>(0);

  // Store the current winner being displayed
  const [winner, setWinner] = useState<Participant | null>(null);
  // Loading state to show spinner during the draw animation
  const [loading, setLoading] = useState(false);
  // Store main prize winners (prizes 4-20)
  const [winners, setWinners] = useState<Participant[]>([]);
  // Store bumper prize winners (first 3 prizes)
  const [bumperWinners, setBumperWinners] = useState<Participant[]>([]);
  // Control visibility of the winner announcement modal
  let [showModal, setShowModal] = useState(false);

  // Load participant data from JSON file on component mount
  useEffect(() => {
    fetch("/data.json")
      .then((response) => response.json())
      .then((jsonData) => setParticipants(jsonData))
      .catch((error) => console.error("Error loading JSON:", error));
  }, []);

  // Main draw function that selects a random winner
  const drawWinner = () => {
    // Prevent drawing after reaching the limit of 20 winners
    if (drawCount >= 20) return;
    setLoading(true); // Show spinner

    // Add delay to simulate the spinning wheel animation
    setTimeout(() => {
      // Select a random participant from the remaining pool
      const randomIndex = Math.floor(Math.random() * participants.length);
      setWinner(participants[randomIndex]);
      setDrawCount(++drawCount);

      // First 3 winners go to bumper prizes, rest go to main winners
      if (bumperWinners.length < 3) {
        const bumpersArray = bumperWinners;
        bumpersArray.push(participants[randomIndex]);
        setBumperWinners(bumpersArray);
      } else {
        const winnersArray = winners;
        winnersArray.push(participants[randomIndex]);
        setWinners(winnersArray);
      }

      // Remove the selected participant from the pool to prevent duplicate wins
      setParticipants(
        participants.filter(
          (participant) =>
            participant.token !== participants[randomIndex].token,
        ),
      );

      setShowModal(true);
      setLoading(false); // Hide spinner
    }, 2000); // Simulate suspense (2 seconds)

    console.log(participants);
  };

  return (
    <div className="container text-center mt-1">
      {/* Animated marquee displaying all remaining participant tokens */}
      <div className="marquee-container">
        <div className="marquee">
          {[...participants].map((participant, index) => (
            <span key={index} className="marquee-item">
              {participant.token}
            </span>
          ))}
        </div>
      </div>

      {/* Primary action button to draw a winner */}
      <button
        onClick={drawWinner}
        className="btn btn-danger my-4 btn-lg fs-2 p-4"
      >
        Draw Winner
      </button>

      {/* Loading spinner that displays during the draw animation */}
      {loading && (
        <div className="row d-flex justify-content-center">
          <div className="text-center mt-3" role="status">
            <img src="/spin-wheel.webp" alt="Spin Wheel" />
          </div>
        </div>
      )}

      {/* Modal popup that announces the current winner */}
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

      {/* Section displaying the first 3 bumper prize winners in collapsible cards */}
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

      {/* Table showing all main prize winners (prizes 4-20) */}
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
