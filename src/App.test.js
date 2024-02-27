import React from "react";
import { render, fireEvent } from "@testing-library/react";
import File from "./file";

describe("File Component", () => {
  it("renders without crashing", () => {
    render(<File />);
  });

  it("displays loading message initially", () => {
    const { getByText } = render(<File />);
    expect(getByText("LOADING")).toBeInTheDocument();
  });

  it("starts the game when key is pressed", () => {
    const { getByText, getByTestId } = render(<File />);
    fireEvent.keyDown(getByTestId("container"), { keyCode: 38 }); // Simulate up arrow key press
    expect(getByText("SCORE: 0")).toBeInTheDocument();
  });

  it("restarts the game when game over", () => {
    const { getByText, getByTestId } = render(<File />);
    fireEvent.keyDown(getByTestId("container"), { keyCode: 38 }); // Simulate up arrow key press
    fireEvent.click(getByText("GAME OVER"));
    expect(getByText("LOADING")).toBeInTheDocument();
  });
});
