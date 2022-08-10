/*
 * Positive & Negative Cartesian Coordinate Systems
 *
 * This module provides a notion of Cartesian coordinate system. A coordinate
 * system can be positive (as is customary in Mathematics) or negative
* (computer screen coordinate systems.) It supports automatic conversions
* between such systems by defining how they are embedded into each other.
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
import TraceError from "trace-error";
import type { FlattenPrimitive } from "./Primitives";
import { isPrimitive, isPoint, isVector, isSegment, isLine, isBox, isPolygon } from "./Primitives";
import inspect from "object-inspect";


// Private Symbol to store the coordinate system inside a proxy object for a
// geometric primitive; extract with CartesianCoordinateSystem.parent().
const COORDINATE_SYSTEM = Symbol("CoordinateSystem");

// Private Symbol to store the underlying geometric primitive without any
// coordinate system automatisms; extract with
// CartesianCoordinateSystem.withoutCoordinateSystem().
const WITHOUT_COORDINATE_SYSTEM = Symbol("RAW");

// Type declaration for a geometric primitive with an added coordinate system
// proxy.
type WithCoordinateSystemProxy<T extends FlattenPrimitive> = T & {
  [COORDINATE_SYSTEM]: CartesianCoordinateSystem | null;
  [WITHOUT_COORDINATE_SYSTEM]: T;
};


// A Cartesian coordinate system. Can be either positive (maths) or negative
// (computer screen).
// The coordinate systems can be named for easier debugging.
export default class CartesianCoordinateSystem {
  public constructor(positive: boolean, name?: string) {
    this.positive = positive;
    this.name = name || "unnamed coordinate system";
  }

  // Whether the positive y axis is counterclockwise from the positive x axis,
  // i.e., y coordinates grow going North.
  public readonly positive: boolean;
  public readonly name: string;

  // Linear affine embeddings into other coordinate systems.
  // Currently, we do not clean up this Map so we keep all reachable coordinate
  // systems alive indefinitely.
  public readonly embeddings: Map<CartesianCoordinateSystem, Flatten.Matrix> = new Map();

  // Register an embedding from this coordinate system into ``into``.
  public defineEmbedding(into: CartesianCoordinateSystem, embedding?: Flatten.Matrix): void {
    if (embedding === undefined) {
      embedding = this.positive === into.positive ? 
        new Flatten.Matrix() :
        new Flatten.Matrix(1, 0, 0, -1);
    }

    this.embeddings.set(into, embedding);
    into.embeddings.set(this, CartesianCoordinateSystem.inverse(embedding));
  }

  // Create a Point in this coordinate system.
  // Prefer this to invoking `new Flatten.Point()` and then calling `embed`
  // since this makes sure that parameters are correctly unwrapped and
  // flatten-js does not get confused about our coordinate system proxies.
  public point(x?: number, y?: number): Flatten.Point;
  public point(arg?: [number, number]): Flatten.Point;
  public point(...args: unknown[]) {
    return this.embed(new Flatten.Point(...args as any));
  }

  // Create a Vector in this coordinate system.
  // Prefer this to invoking `new Flatten.Vector()` and then calling `embed`
  // since this make sure that the parameters are correctly unwrappend and
  // flatten-js does not get confused about our coordinate system proxies.
  public vector(x?: number, y?: number): Flatten.Vector;
  public vector(ps: Flatten.Point, pe: Flatten.Point): Flatten.Vector;
  public vector(...args: unknown[]) {
    args = args.map((a) => this.unwrapArgument(a))
    return this.embed(new Flatten.Vector(...args as any));
  }

  // Create a Line Segment in this coordinate system.
  // Prefer this to invoking `new Flatten.Segment()` and then calling `embed`
  // since this make sure that the parameters are correctly unwrappend and
  // flatten-js does not get confused about our coordinate system proxies.
  public segment(ps?: Flatten.Point, pe?: Flatten.Point): Flatten.Segment;
  public segment(...args: unknown[]) {
    args = args.map((a) => this.unwrapArgument(a))
    return this.embed(new Flatten.Segment(...args as any));
  }

  // Create a Line in this coordinate system.
  // Prefer this to invoking `new Flatten.Line()` and then calling `embed`
  // since this make sure that the parameters are correctly unwrappend and
  // flatten-js does not get confused about our coordinate system proxies.
  public line(pt?: Flatten.Point, norm?: Flatten.Vector): Flatten.Line;
  public line(norm: Flatten.Vector, pt: Flatten.Point): Flatten.Line;
  public line(pt1: Flatten.Point, pt2: Flatten.Point): Flatten.Line;
  public line(...args: unknown[]) {
    args = args.map((a) => this.unwrapArgument(a))
    return this.embed(new Flatten.Line(...args as any));
  }

  // Create a Box in this coordinate system.
  // Prefer this to invoking `new Flatten.Box()` and then calling `embed`
  // since this make sure that the parameters are correctly unwrappend and
  // flatten-js does not get confused about our coordinate system proxies.
  public box(xmin?: number, ymin?: number, xmax?: number, ymax?: number): Flatten.Box;
  public box(...args: unknown[]) {
    args = args.map((a) => this.unwrapArgument(a))
    return this.embed(new Flatten.Box(...args as any));
  }

  // Create a Polygon in this coordinate system.
  // Prefer this to invoking `new Flatten.Polygon()` and then calling `embed`
  // since this make sure that the parameters are correctly unwrappend and
  // flatten-js does not get confused about our coordinate system proxies.
  public polygon(args?: Flatten.LoopOfShapes | Flatten.Circle | Flatten.Box | Flatten.MultiLoopOfShapes): Flatten.Polygon;
  public polygon(...args: unknown[]) {
    args = args.map((a) => this.unwrapArgument(a))
    return this.embed(new Flatten.Polygon(...args as any));
  }

  // Return whether ``value`` is a proxy of a geometric primitive that adds a
  // coordinate system.
  private static isCoordinateSystemProxy<T extends FlattenPrimitive>(value: T | WithCoordinateSystemProxy<T>): value is WithCoordinateSystemProxy<T> {
    return COORDINATE_SYSTEM in value;
  }

  // Return ``value`` as a raw Flatten object without any coordinate system
  // automatisms attached to it.
  public static withoutCoordinateSystem<T extends FlattenPrimitive>(value: T | WithCoordinateSystemProxy<T>): T {
    if (!CartesianCoordinateSystem.isCoordinateSystemProxy(value))
      return value;

    return value[WITHOUT_COORDINATE_SYSTEM];
  }

  // Return the coordinate system ``value`` is defined in, if any.
  public static parent(value: FlattenPrimitive): CartesianCoordinateSystem | null {
    if (!CartesianCoordinateSystem.isCoordinateSystemProxy(value))
      return null;

    return value[COORDINATE_SYSTEM];
  }

  // Return a matrix that embeds this coordinate system into ``other``.
  // Return ``null`` if there is no such embedding.
  public discover(other: CartesianCoordinateSystem): Flatten.Matrix | null {
    if (this.embeddings.has(other))
      return this.embeddings.get(other)!;
    throw Error("not implemented: discover()");
  }

  // Create a proxy for the geometric primitive ``value``.
  // That proxy is going to make sure that any method called converts all its
  // arguments into the same coordinate system.
  private createProxy<T extends FlattenPrimitive>(value: T): T {
    const coordinateSystem = this;

    const parent = CartesianCoordinateSystem.parent(value);

    if (parent !== null)
      throw Error("object is already a coordinate system proxy");

    return new Proxy(value, {
      has(target, key) {
        if (key === COORDINATE_SYSTEM)
          return true;
        if (key === WITHOUT_COORDINATE_SYSTEM)
          return true;

        return key in target;
      },
      get(target, prop, receiver) {
        if (prop === COORDINATE_SYSTEM)
          return coordinateSystem;

        if (prop === WITHOUT_COORDINATE_SYSTEM) {
          console.assert(!CartesianCoordinateSystem.isCoordinateSystemProxy(target));
          return target;
        }

        const original = Reflect.get(target, prop, receiver);

        if (prop === "toJSON")
          return original;

        if (typeof original === "function") {
          return new Proxy(original, {
            apply(target, thisArg, args) {
              try {
                thisArg = CartesianCoordinateSystem.withoutCoordinateSystem(thisArg);
                args = args.map((arg) => coordinateSystem.unwrapArgument(arg));

                return coordinateSystem.wrapReturnValue(target.bind(thisArg)(...args));
              } catch(e) {
                throw new TraceError(`failed to invoke ${target} with arguments ${inspect(args)}`, e as any);
              }
            },
          });
        }

        if (isPrimitive(original))
          return coordinateSystem.embed(original);

        return original;
      },
    });
  }

  // Return ``value`` as an element of this coordinate system.
  public embed(point: Flatten.Point): Flatten.Point;
  public embed(vector: Flatten.Vector): Flatten.Vector;
  public embed(segment: Flatten.Segment): Flatten.Segment;
  public embed(line: Flatten.Line): Flatten.Line;
  public embed(polygon: Flatten.Box): Flatten.Box | Flatten.Polygon;
  public embed(polygon: Flatten.Polygon): Flatten.Polygon;
  public embed(value: FlattenPrimitive): FlattenPrimitive;
  public embed(value: FlattenPrimitive) : FlattenPrimitive{ 
    const parent = CartesianCoordinateSystem.parent(value);

    if (parent === this)
      return value;

    if (parent === null)
      return this.createProxy(value);

    if (!isPrimitive(value))
      throw Error("cannot embed this kind of object into a coordinate system yet");

    const discovered = parent.discover(this);

    if (discovered === null)
      throw Error("No embedding between these coordinate systems");

    console.assert(discovered.tx != null && discovered.ty != null && discovered.a * discovered.d - discovered.b * discovered.c, "Discovered an embedding that is not invertible.", discovered);

    if (isPoint(value) || isSegment(value) || isPolygon(value))
      return this.embed(
        CartesianCoordinateSystem.withoutCoordinateSystem(value).transform(discovered)
      );

    if (isVector(value))
      return this.vector(parent.point(0, 0), parent.point(value.x, value.y));

    if (isLine(value))
      return this.line(value.pt, value.norm);

    if (isBox(value)) {
      const points = this.unwrapArgument(value.toPoints());

      const polygon = this.polygon(points);

      if ((new Set(points.map((p) => p.x))).size !== 2 || (new Set(points.map((p) => p.y))).size !== 2)
        return polygon;

      return polygon.box;
    }

    throw Error("cannot embed this kind of geometric primitive yet");
  }

  // Prepare ``value`` as an argument for a flatten-js function call.
  // This brings ``value`` into the current coordinate system and removes our
  // coordinate proxy.
  private unwrapArgument<T>(value: T): T {
    return this.wrapReturnValue(value, true);
  }

  // Wrap ``value`` as a return value to be handed back from a flatten-js
  // function call.
  // This wraps ``value`` in our coordinate proxy to annotate that it lives in
  // this coordinate system.
  // If ``unwrap`` is set, the object is only brought into the current
  // coordinate system but all coordinate system proxies are removed.
  private wrapReturnValue<T>(value: T, unwrap: boolean = false): T {
    if (isPrimitive(value)) {
      let wrapped = this.embed(value);
      if (unwrap)
        wrapped = CartesianCoordinateSystem.withoutCoordinateSystem(wrapped);

      // The embedding of a box might not be representable as a box anymore.
      // When this happens we refuse to continue since this is almost certainly
      // going to lead to problems when calling a method that expects a box
      // (since TypeScript is not going to notice that type change.)
      if (isBox(value) && !isBox(wrapped))
        throw Error(`cannot automatically convert box ${inspect(value)} since it converts to a polygon and thus changed type`);

      return wrapped as unknown as T;
    }

    if (typeof value === "boolean")
      return value;
    if (typeof value === "number")
      return value;
    if (typeof value === "string")
      return value;
    if (value == null)
      return value;

    if (Array.isArray(value))
      return value.map((a) => this.wrapReturnValue(a, unwrap)) as unknown as T;

    throw Error(`cannot automatically translate ${inspect(value)} into this coordinate system yet`);
  }

  // Return the inverse of the invertible matrix A.
  // Naturally, this is not very stable numerically. Probably we shuold solve
  // linear equations instead of holding on to an explicit inverse.
  private static inverse(A: Flatten.Matrix): Flatten.Matrix {
    const [a00, a01, a02, a10, a11, a12, a20, a21, a22] = [A.a, A.c, A.tx, A.b, A.d, A.ty, 0, 0, 1];
    const adj = [a11*a22 - a21*a12, a10*a22 - a20*a12, a10*a21 - a20*a11, a01*a22 - a21*a02, a00*a22 - a20*a02, a00*a21 - a20*a01, a01*a12 - a11*a02, a00*a12 - a10*a02, a00*a11 - a10*a01];
    const det = a00*adj[0] - a01*adj[1] + a02*adj[2];
    const inv = [adj[0], -adj[3], adj[6], -adj[1], adj[4], -adj[7], adj[2], -adj[5], adj[8]].map(a => a / det);
    const affine = inv.map(a => a / inv[8]);
    console.assert(affine.every((a) => a != null), `Matrix ${A} must be invertible.`);
    return new Flatten.Matrix(affine[0], affine[3], affine[1], affine[4], affine[2], affine[5]);
  }
}
