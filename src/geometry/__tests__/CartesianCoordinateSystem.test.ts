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

import { describe, it, expect } from "vitest";

import Flatten from "@flatten-js/core";

import CartesianCoordinateSystem from "@/geometry/CartesianCoordinateSystem";

import GeometricEqualityAssertion from "./GeometricEqualityAssertion";

describe("CartesianCoordinateSystem", () => {
  expect.extend(GeometricEqualityAssertion);

   describe("a negative SVG coordinate system embedded into an ideal positive coordinate system such that (0, 0) are identified", () => {
    const ideal = new CartesianCoordinateSystem(true, "ideal");
    const svg = new CartesianCoordinateSystem(false, "SVG");

    svg.defineEmbedding(ideal);

    it("converts point coordinates correctly", () => {
      expect(svg.point(0, 0)).geometryEqualTo(new Flatten.Point(0, 0));
      expect(svg.point(0, 0)).geometryEqualTo(ideal.point(0, 0));
      expect(svg.point(1, 0)).geometryEqualTo(ideal.point(1, 0));
      expect(svg.point(0, 1)).geometryEqualTo(svg.embed(ideal.point(0, -1)));
      expect(svg.point(0, 1)).geometryEqualTo(ideal.point(0, -1));
    });

    it("converts vectors correctly", () => {
      expect(svg.vector(1, 2)).geometryEqualTo(new Flatten.Vector(1, 2));
      expect(svg.vector(1, 2)).geometryEqualTo(svg.embed(ideal.vector(1, -2)));
      expect(svg.vector(1, 2)).geometryEqualTo(ideal.vector(1, -2));
    });

    it("converts line segments correctly", () => {
      expect(svg.segment(
        svg.point(1, 2),
        svg.point(3, 5)
      )).geometryEqualTo(ideal.segment(
        ideal.point(1, -2),
        ideal.point(3, -5)
      ));
    });

    it("converts lines correctly", () => {
      expect(svg.line(
         svg.point(1, 2),
         svg.point(3, 5)
       )).geometryEqualTo(ideal.line(
         ideal.point(1, -2),
         ideal.point(3, -5)
       ));
     });

    it("converts boxes correctly", () => {
      expect(svg.box(1, 2, 3, 5))
        .geometryEqualTo(ideal.box(1, -5, 3, -2));
    });

    it("converts polygons correctly", () => {
      expect(svg.polygon([[0, 0], [1, 1], [3, 5], [0, 10]]))
        .geometryEqualTo(ideal.polygon([[0, 0], [1, -1], [3, -5], [0, -10]]))
    });
  });
});
