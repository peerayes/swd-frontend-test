"use client";

import { Button, Card, Space, Typography } from "antd";
import { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./move-shape.module.scss";

const { Title } = Typography;

type Shape =
  | "square"
  | "circle"
  | "ellipse"
  | "trapezoid"
  | "rectangle"
  | "parallelogram";

interface ShapePosition {
  shape: Shape;
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

  // swap rows with continuous pipeline
  const moveVertical = (direction: "up" | "down") => {
    setIsAnimating(true);
    setAnimationClass(direction === "up" ? styles.slideUp : styles.slideDown);

    setTimeout(() => {
      setBoard((prev) => {
        // Get current shapes from each row
        const row1Shapes = prev.row1.map((item) => item.shape);
        const row2Shapes = prev.row2.map((item) => item.shape);

        // Create new board with swapped shapes but correct positions
        const newBoard: AnimatedBoard = {
          row1: [
            { shape: row2Shapes[0], position: 0, row: "top" as const },
            { shape: row2Shapes[1], position: 1, row: "top" as const },
            { shape: row2Shapes[2], position: 2, row: "top" as const },
          ],
          row2: [
            { shape: row1Shapes[0], position: 3, row: "bottom" as const },
            { shape: row1Shapes[1], position: 4, row: "bottom" as const },
            { shape: row1Shapes[2], position: 5, row: "bottom" as const },
          ],
        };

        return newBoard;
      });

      setTimeout(() => {
        setIsAnimating(false);
        setAnimationClass("");
      }, 100);
    }, 400);
  };

  // continuous pipeline
  const moveHorizontal = (direction: "left" | "right") => {
    setIsAnimating(true);
    setAnimationClass(
      direction === "left" ? styles.slideLeft : styles.slideRight,
    );

    setTimeout(() => {
      setBoard((prev) => {
        const continuous = boardToContinuous(prev);
        const shiftedContinuous = shiftContinuous(continuous, direction);
        return continuousToBoard(shiftedContinuous);
      });

      setTimeout(() => {
        setIsAnimating(false);
        setAnimationClass("");
      }, 100);
    }, 400);
  };

  const moveShape = (direction: string) => {
    if (isAnimating) return; // Prevent multiple clicks during animation

    switch (direction) {
      case "up":
        moveVertical("up");
        break;
      case "down":
        moveVertical("down");
        break;
      case "left":
        moveHorizontal("left");
        break;
      case "right":
        moveHorizontal("right");
        break;
    }
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
        }`}
      />
    );
  };

  const resetBoard = () => {
    setIsAnimating(true);
    setAnimationClass(styles.animating);

    setTimeout(() => {
      setBoard(initialBoard);
      setTimeout(() => {
        setIsAnimating(false);
        setAnimationClass("");
      }, 300);
    }, 100);
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
