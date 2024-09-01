import {
  Button,
  Center,
  Divider,
  Group,
  NumberInput,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";
import { Navbar } from "./Navbar";

const MAX_GUESSES = 4;

type Guess = {
  guess: number;
  feedback: string;
  direction: "🔽" | "🔼" | "😛";
};

function App() {
  const [guess, setGuess] = useState<number | "">(0);
  const [error, setError] = useState("");
  const [actualAngle, setActualAngle] = useState(0);
  const [gameState, setGameState] = useState<"playing" | "won" | "lost">(
    "playing"
  );
  const [svgPaths, setSvgPaths] = useState({ line1: {}, line2: {}, arc: "" });
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [guessCount, setGuessCount] = useState(0);

  const updateSvgPaths = (angle: number) => {
    const centerX = 150;
    const centerY = 100;
    const radius = 80;

    const startAngle = Math.random() * Math.PI;
    const endAngle = startAngle + (angle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);

    const largeArcFlag = angle > 180 ? 1 : 0;
    const arcPath = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;

    setSvgPaths({
      line1: { x1: centerX, y1: centerY, x2: x1, y2: y1 },
      line2: { x1: centerX, y1: centerY, x2: x2, y2: y2 },
      arc: arcPath,
    });
  };

  useEffect(() => {
    const generateRandomAngle = () => {
      const angle = Math.round(Math.random() * 180);
      setActualAngle(angle);
      console.log(angle);
      updateSvgPaths(angle);
    };
    generateRandomAngle();
  }, []);

  const handleGuess = () => {
    setGuessCount(guessCount + 1);

    if (typeof guess !== "number") {
      setError("Please enter a valid number.");
    } else if (guess > 180) {
      setError("Please enter a number less than 180.");
    } else if (guess < 0) {
      setError("Please enter a number greater than 0.");
    } else {
      const difference = Math.abs(guess - actualAngle);
      let feedback = "";
      if (difference === 0) {
        feedback = "🎉";
        setGameState("won");
      } else if (difference <= 5) {
        feedback = "Boiling 🔥";
      } else if (difference <= 15) {
        feedback = "Getting there 🤔";
      } else {
        feedback = "Cold 🥶";
      }
      let direction: "🔽" | "🔼" | "😛" = "😛";
      if (Number(guess) > actualAngle) {
        direction = "🔽";
      } else if (Number(guess) < actualAngle) {
        direction = "🔼";
      } else {
        direction = "😛";
      }
      setGuesses([
        ...guesses,
        {
          guess: Number(guess),
          feedback,
          direction,
        },
      ]);
      if (guessCount + 1 === MAX_GUESSES) {
        if (difference !== 0) {
          setError(`Game over! The actual angle was ${actualAngle}°`);
          setGameState("lost");
        }
      }
    }
    setGuess("");
  };

  return (
    <>
      {gameState === "won" && (
        <ReactConfetti
          recycle={false}
          numberOfPieces={200}
          tweenDuration={5000}
        />
      )}
      <Center pt={50}>
        <Stack gap="sm" align="center">
          <Navbar />

          <svg width="300" height="200" viewBox="0 0 300 200">
            <path d={svgPaths.arc} fill="none" strokeWidth="2" stroke="#6688" />
            <line
              {...svgPaths.line1}
              style={{ stroke: "rgb(223, 98, 71)", strokeWidth: "2px" }}
            />
            <line
              {...svgPaths.line2}
              style={{ stroke: "rgb(223, 98, 71)", strokeWidth: "2px" }}
            />
            <circle cx="150" cy="100" r="3" fill="black" stroke="white" />
          </svg>

          <NumberInput
            value={guess}
            onChange={(value) => setGuess(Number(value))}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleGuess();
              }
            }}
            placeholder="Enter your guess in degrees"
            min={0}
            max={180}
            stepHoldDelay={500}
            stepHoldInterval={100}
            style={{ width: "100%" }}
          />
          <Button
            onClick={handleGuess}
            fullWidth
            disabled={gameState !== "playing"}
          >
            Submit Guess
          </Button>
          {gameState !== "playing" && (
            <Button onClick={() => window.location.reload()}>Play Again</Button>
          )}
          <Text>{error}</Text>
          <Text fw={600} style={{ textAlign: "center" }}>
            Attempts {guessCount} / {MAX_GUESSES}
          </Text>
          {guesses.map((guess, index) => (
            <Paper key={index} p="xs" bg="dark.6" withBorder>
              <Group>
                <Text ta="center">{guess.guess}</Text>
                <Divider orientation="vertical" />
                <Text ta="center">{guess.feedback}</Text>
                <Divider orientation="vertical" />
                <Text ta="center">{guess.direction}</Text>
              </Group>
            </Paper>
          ))}
        </Stack>
      </Center>
    </>
  );
}

export default App;
