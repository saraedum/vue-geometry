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

import type { FlattenPrimitive } from "@/geometry/Primitives";

import {equalTo, closeTo} from "@/geometry/Primitives";

export default {
  geometryCloseTo<T extends FlattenPrimitive>(received: T, expected: T, epsilon: number = 0) {
    return {
      message: () => `expected ${JSON.stringify(received)} to be close to ${JSON.stringify(expected)}`,
      pass: closeTo(received, expected, epsilon),
    };
  },
  geometryEqualTo<T extends FlattenPrimitive>(received: T, expected: T) {
    return {
      message: () => `expected ${JSON.stringify(received)} to be ${JSON.stringify(expected)}`,
      pass: equalTo(received, expected),
    };
  },
};


interface CustomMatchers<R = unknown> {
  geometryCloseTo(other: R): R
  geometryEqualTo(other: R): R
}

declare global {
  namespace Vi {
    interface Assertion extends CustomMatchers {}
    interface AsymmetricMatchersContaining extends CustomMatchers {}
  }
}
