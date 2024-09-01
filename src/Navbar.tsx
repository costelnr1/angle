import { Button, Center, Group, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconBrandGithub, IconQuestionMark } from "@tabler/icons-react";

export function Navbar() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Center>
      <Group>
        <Modal opened={opened} onClose={close} title="How to play" centered>
          <Text>📐 Guess the angle degrees of a random angle</Text>
          <br />
          <Text>🔢 You have 4 attempts to guess the angle</Text>
          <br />
          <Text>
            🎯 After each guess, you will get feedback on how close your guess
            was to the actual angle.
          </Text>
          <br />
          <Text>
            Inspired by <a href="https://angle.wtf">angle.wtf</a>
          </Text>
          <br />
          <Text>🍀 Good luck!</Text>
        </Modal>

        <Button variant="transparent" onClick={open}>
          <IconQuestionMark />
        </Button>

        <Text size="lg" fw={600} style={{ textAlign: "center" }}>
          Angle Guessing Game
        </Text>

        <Button
          variant="transparent"
          onClick={() =>
            window.open("https://github.com/costidotdev/angle", "_blank")
          }
        >
          <IconBrandGithub />
        </Button>
      </Group>
    </Center>
  );
}
