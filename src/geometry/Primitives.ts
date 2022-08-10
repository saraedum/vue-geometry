/*
 * Geometric primitives such as Points, Vector, Lines, Segments, …
 *
 * This module wraps and enhances the flatten-js geometry library.
 * Usually, you don't want to use the functions defined here directly but use
 * ``CartesianCoordinateSystem`` instead.
 */

/* ******************************************************************************
 *  This file is part of vue-geometry.
 *
 *        Copyright (c) 2020-2022 Julian Rüth
 * 
 *  vue-geometry is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  vue-geometry is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with vue-geometry. If not, see <https://www.gnu.org/licenses/>.
 * *****************************************************************************/

import Flatten from "@flatten-js/core";
import zip from "lodash-es/zip";
import CartesianCoordinateSystem from "./CartesianCoordinateSystem";

// The geometric primitives from the Flatten library that can have an
// added coordinate system.
export type FlattenPrimitive =
  Flatten.Point |
  Flatten.Vector |
  Flatten.Segment |
  Flatten.Line |
  Flatten.Box |
  Flatten.Polygon |
  Flatten.Face;

// Return whether ``value`` is a geometric primitive provided by the flatten library..
// This is a type guard to check whether something is a geometric primitive in TypeScript.
export function isPrimitive(value: unknown): value is FlattenPrimitive {
  return value instanceof Flatten.Point ||
         value instanceof Flatten.Vector || 
         value instanceof Flatten.Segment ||
         value instanceof Flatten.Line ||
         value instanceof Flatten.Box ||
         value instanceof Flatten.Polygon ||
         value instanceof Flatten.Face;
}

// Return whether ``point`` is a point object.
// This is a type guard to check whether something is a point in TypeScript.
export function isPoint(point: FlattenPrimitive): point is Flatten.Point {
  return point instanceof Flatten.Point;
}

// Return whether ``vector`` is a vector object.
// This is a type guard to check whether something is a vector in TypeScript.
export function isVector(vector: FlattenPrimitive): vector is Flatten.Vector {
  return vector instanceof Flatten.Vector;
}

// Return whether ``segment`` is a segment object.
// This is a type guard to check whether something is a segment in TypeScript.
export function isSegment(segment: FlattenPrimitive): segment is Flatten.Segment {
  return segment instanceof Flatten.Segment;
}

// Return whether ``line`` is a line object.
// This is a type guard to check whether something is a line in TypeScript.
export function isLine(line: FlattenPrimitive): line is Flatten.Line {
  return line instanceof Flatten.Line;
}

// Return whether ``box`` is a box object.
// This is a type guard to check whether something is a box in TypeScript.
export function isBox(box: FlattenPrimitive): box is Flatten.Box {
  return box instanceof Flatten.Box;
}

// Return whether ``polygon`` is a polygon object.
// This is a type guard to check whether something is a polygon in TypeScript.
export function isPolygon(polygon: FlattenPrimitive): polygon is Flatten.Polygon {
  return polygon instanceof Flatten.Polygon;
}

// Return whether ``face`` is a face object.
// This is a type guard to check whether something is a face in TypeScript.
export function isFace(face: FlattenPrimitive): face is Flatten.Face {
  return face instanceof Flatten.Face;
}

// Return whether ``lhs`` and ``rhs`` are equal up to an error of ``epsilon``.
export function closeTo(lhs: FlattenPrimitive, rhs: typeof lhs, epsilon: number): boolean {
  const tolerance = Flatten.Utils.getTolerance();
  Flatten.Utils.setTolerance(epsilon);
  try {
    if (lhs instanceof Flatten.Point || rhs instanceof Flatten.Point) {
      if (!(lhs instanceof Flatten.Point) || !(rhs instanceof Flatten.Point))
        return false;

      return lhs.equalTo(rhs);
    }

    if (lhs instanceof Flatten.Vector || rhs instanceof Flatten.Vector) {
      if (!(lhs instanceof Flatten.Vector) || !(rhs instanceof Flatten.Vector))
        return false;

      return lhs.equalTo(rhs);
    }

    if (lhs instanceof Flatten.Segment || rhs instanceof Flatten.Segment) {
      if (!(lhs instanceof Flatten.Segment) || !(rhs instanceof Flatten.Segment))
        return false;

      return lhs.equalTo(rhs);
    }

    if (lhs instanceof Flatten.Line || rhs instanceof Flatten.Line) {
      if (!(lhs instanceof Flatten.Line) || !(rhs instanceof Flatten.Line))
        return false;

      return lhs.incidentTo(rhs);
    }

    if (lhs instanceof Flatten.Box || rhs instanceof Flatten.Box) {
      if (!(lhs instanceof Flatten.Box) || !(rhs instanceof Flatten.Box))
        return false;

      return lhs.equal_to(rhs);
    }

    if (lhs instanceof Flatten.Polygon || rhs instanceof Flatten.Polygon) {
      if (!(lhs instanceof Flatten.Polygon) || !(rhs instanceof Flatten.Polygon))
        return false;

      const parent = CartesianCoordinateSystem.parent(lhs) || CartesianCoordinateSystem.parent(rhs);

      if (parent !== null)
        return equalTo(CartesianCoordinateSystem.withoutCoordinateSystem(parent.embed(lhs)),
                       CartesianCoordinateSystem.withoutCoordinateSystem(parent.embed(rhs)));

      return Flatten.Relations.equal(lhs, rhs);
    }

    throw Error("not implemented: comparing these geometric objects");
  } finally {
    Flatten.Utils.setTolerance(tolerance);
  }
}

// Return whether ``lhs`` and ``rhs`` are identical.
// This compares the underlying floating point coordinates for exact equality
// which is usually not what you want. Use ``closeTo`` instead.
export function equalTo(lhs: FlattenPrimitive, rhs: FlattenPrimitive): boolean {
  return closeTo(lhs, rhs, Number.MIN_VALUE);
}
