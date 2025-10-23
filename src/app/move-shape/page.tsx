"use client";

import { Button, Card, Space, Typography } from "antd";
import { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./move-shape.module.scss";

const { Title } = Typography;

interface ShapePosition {
  shape:
    | "square"
    | "circle"
    | "ellipse"
    | "trapezoid"
    | "rectangle"
    | "parallelogram";
  position: number; // 0, 1, 2, 3, 4, 5 for continuous pipeline
  row: "top" | "bottom";
}

interface AnimatedBoard {
  row1: ShapePosition[];
  row2: ShapePosition[];
}

const initialBoard: AnimatedBoard = {
  row1: [
    { shape: "square", position: 0, row: "top" },
    { shape: "circle", position: 1, row: "top" },
    { shape: "ellipse", position: 2, row: "top" },
  ],
  row2: [
    { shape: "trapezoid", position: 3, row: "bottom" },
    { shape: "rectangle", position: 4, row: "bottom" },
    { shape: "parallelogram", position: 5, row: "bottom" },
  ],
};

export default function MoveShape() {
  const { t } = useTranslation();
  const [board, setBoard] = useState<AnimatedBoard>(initialBoard);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationClass, setAnimationClass] = useState<string>("");

  // Convert board to continuous array and back
  const boardToContinuous = (board: AnimatedBoard): ShapePosition[] => {
    return [...board.row1, ...board.row2].sort(
      (a, b) => a.position - b.position,
    );
  };

  const continuousToBoard = (continuous: ShapePosition[]): AnimatedBoard => {
    return {
      row1: continuous.slice(0, 3).map((item, index) => ({
        ...item,
        row: "top" as const,
        position: index,
      })),
      row2: continuous.slice(3, 6).map((item, index) => ({
        ...item,
        row: "bottom" as const,
        position: index + 3,
      })),
    };
  };

  // Animation helper to reduce code duplication
  const animateMove = (animationClass: string, logic: () => void) => {
    setIsAnimating(true);
    setAnimationClass(animationClass);
    setTimeout(() => {
      logic();
      setTimeout(() => {
        setIsAnimating(false);
        setAnimationClass("");
      }, 100);
    }, 400);
  };

  // Shift continuous array
  const shiftContinuous = (
    arr: ShapePosition[],
    direction: "left" | "right",
  ): ShapePosition[] => {
    const length = arr.length;
    return arr.map((item, index) => {
      let newPosition: number;
      if (direction === "left") {
        newPosition = (index + 1) % length;
      } else {
        newPosition = (index - 1 + length) % length;
      }
      return { ...arr[newPosition], position: index };
    });
  };

  // Logic for swapping rows
  const moveVerticalLogic = (direction: "up" | "down") => {
    setBoard((prev) => {
      // Get current shapes from each row
      const row1Shapes = prev.row1.map((item) => item.shape);
      const row2Shapes = prev.row2.map((item) => item.shape);

      // Create continuous array with swapped shapes
      const swappedContinuous = [
        ...row2Shapes.map((shape, index) => ({
          shape,
          position: index,
          row: "top" as const,
        })),
        ...row1Shapes.map((shape, index) => ({
          shape,
          position: index + 3,
          row: "bottom" as const,
        })),
      ];

      return continuousToBoard(swappedContinuous);
    });
  };

  // swap rows with continuous pipeline
  const moveVertical = (direction: "up" | "down") => {
    animateMove(direction === "up" ? styles.slideUp : styles.slideDown, () =>
      moveVerticalLogic(direction),
    );
  };

  // continuous pipeline
  const moveHorizontal = (direction: "left" | "right") => {
    animateMove(
      direction === "left" ? styles.slideLeft : styles.slideRight,
      () => {
        setBoard((prev) => {
          const continuous = boardToContinuous(prev);
          const shiftedContinuous = shiftContinuous(continuous, direction);
          return continuousToBoard(shiftedContinuous);
        });
      },
    );
  };

  // Direction mapper to replace switch statement
  const directionHandlers = {
    up: () => moveVertical("up"),
    down: () => moveVertical("down"),
    left: () => moveHorizontal("left"),
    right: () => moveHorizontal("right"),
  };

  const moveShape = (direction: string) => {
    if (isAnimating) return; // Prevent multiple clicks during animation

    const handler =
      directionHandlers[direction as keyof typeof directionHandlers];
    if (handler) {
      handler();
    }
  };

  // Shuffle array function for randomizing all shapes
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Handle shape click for shuffling all shapes
  const handleShapeClick = (shapePosition: ShapePosition) => {
    console.log(
      "Shape clicked:",
      shapePosition.shape,
      "at position:",
      shapePosition.position,
      "row:",
      shapePosition.row,
    );

    // Shuffle all shapes immediately - no animation blocking
    const allShapes = [...board.row1, ...board.row2];
    const shuffledShapes = shuffleArray(allShapes);
    const newBoard = continuousToBoard(shuffledShapes);

    // Update board instantly
    setBoard(newBoard);
  };

  const renderShape = (shapePosition: ShapePosition, key: string) => {
    const { shape, position } = shapePosition;
    const positionClass = styles[`position-${position}`];
    const rowClass =
      shapePosition.row === "top" ? styles.topRow : styles.bottomRow;

    return (
      <div
        key={key}
        className={`${styles.shape} ${styles[shape]} ${positionClass} ${rowClass} ${
          isAnimating ? animationClass : ""
        } ${styles.clickable}`}
        onClick={() => handleShapeClick(shapePosition)}
      />
    );
  };

  return (
    <div className={`${styles.moveShapeContainer} min-h-screen bg-gray-50 p-8`}>
      <div className="max-w-4xl mx-auto">
        <Title level={2} className={`${styles.title} text-center mb-8`}>
          Move Shape
        </Title>
        {/* Shape motion state */}
        <Card className={`${styles.gameArea} mb-6`}>
          <div className={styles.gameBoard}>
            <div className={styles.shapeRow}>
              {board.row1.map((shapePos, index) =>
                renderShape(shapePos, `row1-${index}`),
              )}
            </div>
            <div className={styles.shapeRow}>
              {board.row2.map((shapePos, index) =>
                renderShape(shapePos, `row2-${index}`),
              )}
            </div>
            <div className={styles.gridLines}>
              {[...Array(10)].map((_, i) => (
                <div
                  key={`v-${i}`}
                  className={styles.verticalLine}
                  style={{ left: `${i * 10}%` }}
                />
              ))}
              {[...Array(10)].map((_, i) => (
                <div
                  key={`h-${i}`}
                  className={styles.horizontalLine}
                  style={{ top: `${i * 10}%` }}
                />
              ))}
            </div>
          </div>
        </Card>

        {/* Controler */}
        <Card className={`${styles.controls} mb-6`}>
          <div className={styles.controlPanel}>
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="flex flex-col items-center gap-2">
                <Button
                  type="primary"
                  onClick={() => moveShape("up")}
                  className={`${styles.controlBtn} ${styles.upBtn}`}
                  icon={<span className={styles.arrowIcon}>↑</span>}
                  disabled={isAnimating}
                />
                <span className="text-sm font-medium text-gray-400">
                  {t("hero.controls.moveUp")}
                </span>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col items-center gap-2">
                  <Button
                    type="primary"
                    onClick={() => moveShape("left")}
                    className={`${styles.controlBtn} ${styles.leftBtn}`}
                    icon={<span className={styles.arrowIcon}>←</span>}
                    disabled={isAnimating}
                  />
                  <span className="text-sm font-medium text-gray-400">
                    {t("hero.controls.moveLeft")}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Button
                    type="primary"
                    onClick={() => moveShape("down")}
                    className={`${styles.controlBtn} ${styles.downBtn}`}
                    icon={<span className={styles.arrowIcon}>↓</span>}
                    disabled={isAnimating}
                  />
                  <span className="text-sm font-medium text-gray-400">
                    {t("hero.controls.moveDown")}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Button
                    type="primary"
                    onClick={() => moveShape("right")}
                    className={`${styles.controlBtn} ${styles.rightBtn}`}
                    icon={<span className={styles.arrowIcon}>→</span>}
                    disabled={isAnimating}
                  />
                  <span className="text-sm font-medium text-gray-400">
                    {t("hero.controls.moveRight")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
