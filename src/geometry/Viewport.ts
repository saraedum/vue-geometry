/*
 * A pair of ideal/client coordinate systems for provide/inject Vue components.
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
import { inject, provide } from "vue";
import CartesianCoordinateSystem from "./CartesianCoordinateSystem";

const VIEWPORT = Symbol("VIEWPORT");


export default class Viewport {
  constructor(idealCoordinateSystem?: CartesianCoordinateSystem, clientCoordinateSystem?: CartesianCoordinateSystem) {
    if (idealCoordinateSystem === undefined)
      idealCoordinateSystem = new CartesianCoordinateSystem(true, "ideal");
    if (clientCoordinateSystem === undefined) {
      clientCoordinateSystem = new CartesianCoordinateSystem(false, "client");
      clientCoordinateSystem.defineEmbedding(idealCoordinateSystem);
    }

    this.idealCoordinateSystem = idealCoordinateSystem;
    this.clientCoordinateSystem = clientCoordinateSystem;
  }

  public readonly idealCoordinateSystem: CartesianCoordinateSystem;
  public readonly clientCoordinateSystem: CartesianCoordinateSystem;

  public static use(viewport?: Viewport) {
    if (viewport == null) {
      viewport = inject(VIEWPORT);
      if (viewport === undefined)
        throw Error("Parent component must inject viewport with Viewport.use()");
    } else
      provide(VIEWPORT, viewport);

    return {
      viewport: viewport,
      idealCoordinateSystem: viewport.idealCoordinateSystem,
      clientCoordinateSystem: viewport.clientCoordinateSystem,
    };
  }

  public drag(delta: Flatten.Vector) {
    const embedding = this.idealCoordinateSystem.discover(this.clientCoordinateSystem);
    if (embedding == null)
      throw Error("cannot drag, coordinate systems not embedded into each other");

    delta = this.clientCoordinateSystem.embed(delta);

    embedding.tx -= delta.x;
    embedding.ty -= delta.y;

    this.idealCoordinateSystem.defineEmbedding(this.clientCoordinateSystem, embedding);
  }

  public zoom(factor: number, center?: Flatten.Point) {
    let embedding = this.idealCoordinateSystem.discover(this.clientCoordinateSystem);
    if (embedding == null)
      throw Error("cannot zoom, coordinate systems not embedded into each other");

    if (center === undefined) {
      throw new Error("not implemented: zoom without center");
      /*
      center = this.viewport.center;
      center = this.focused.parent.embed(center);

      const width = this.focused.width / factor;
      const height = this.focused.height / factor;

      this.focus(new Box(this.focused.parent,
        [center.x - width / 2, center.y - height / 2],
        [center.x + width / 2, center.y + height / 2]));
      */
    } else {
      const clientCenter = this.clientCoordinateSystem.embed(center);
      const idealCenter = this.idealCoordinateSystem.embed(clientCenter);

      embedding = embedding.multiply(new Flatten.Matrix(factor, 0, 0, factor));
      
      const shift = this.clientCoordinateSystem.vector(clientCenter, CartesianCoordinateSystem.withoutCoordinateSystem(idealCenter).transform(embedding));

      embedding.tx -= shift.x;
      embedding.ty -= shift.y;

      this.idealCoordinateSystem.defineEmbedding(this.clientCoordinateSystem, embedding);
    }
  }
}
