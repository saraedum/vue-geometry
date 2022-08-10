var mf = Object.defineProperty;
var _f = (r, t, e) => t in r ? mf(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var be = (r, t, e) => (_f(r, typeof t != "symbol" ? t + "" : t, e), e);
import { inject as bf, provide as wf, defineComponent as nl, ref as bi, onMounted as xf, onBeforeUnmount as Sf, openBlock as il, createElementBlock as Ef, normalizeClass as $f, renderSlot as ol, createBlock as Of, withCtx as If } from "vue";
const Pf = !0, Tf = !1, Af = { CCW: -1, CW: 1, NOT_ORIENTABLE: 0 }, Rf = 2 * Math.PI, ir = 1, sl = 0, Ft = 2, Lf = 3, Cf = 4, Nf = 1, Mf = 2, io = 0, Hr = 1, Te = 2;
var Xr = /* @__PURE__ */ Object.freeze({
  CCW: Pf,
  CW: Tf,
  ORIENTATION: Af,
  PIx2: Rf,
  INSIDE: ir,
  OUTSIDE: sl,
  BOUNDARY: Ft,
  CONTAINS: Lf,
  INTERLACE: Cf,
  OVERLAP_SAME: Nf,
  OVERLAP_OPPOSITE: Mf,
  NOT_VERTEX: io,
  START_VERTEX: Hr,
  END_VERTEX: Te
});
let Dt = 1e-6;
function al(r) {
  Dt = r;
}
function ll() {
  return Dt;
}
const kf = 3;
function wi(r) {
  return r < Dt && r > -Dt;
}
function he(r, t) {
  return r - t < Dt && r - t > -Dt;
}
function ul(r, t) {
  return r - t > Dt;
}
function Ff(r, t) {
  return r - t > -Dt;
}
function fl(r, t) {
  return r - t < -Dt;
}
function Bf(r, t) {
  return r - t < Dt;
}
var jf = /* @__PURE__ */ Object.freeze({
  setTolerance: al,
  getTolerance: ll,
  DECIMALS: kf,
  EQ_0: wi,
  EQ: he,
  GT: ul,
  GE: Ff,
  LT: fl,
  LE: Bf
});
class xi {
  static get ILLEGAL_PARAMETERS() {
    return new ReferenceError("Illegal Parameters");
  }
  static get ZERO_DIVISION() {
    return new Error("Zero division");
  }
  static get UNRESOLVED_BOUNDARY_CONFLICT() {
    return new Error("Unresolved boundary conflict in boolean operation");
  }
  static get INFINITE_LOOP() {
    return new Error("Infinite loop");
  }
}
let o = {
  Utils: jf,
  Errors: xi,
  Matrix: void 0,
  Planar_set: void 0,
  Point: void 0,
  Vector: void 0,
  Line: void 0,
  Circle: void 0,
  Segment: void 0,
  Arc: void 0,
  Box: void 0,
  Edge: void 0,
  Face: void 0,
  Ray: void 0,
  Ray_shooting: void 0,
  Multiline: void 0,
  Polygon: void 0,
  Distance: void 0,
  Inversion: void 0
};
for (let r in Xr)
  o[r] = Xr[r];
Object.defineProperty(o, "DP_TOL", {
  get: function() {
    return ll();
  },
  set: function(r) {
    al(r);
  }
});
class oo {
  constructor(t, e) {
    this.first = t, this.last = e || this.first;
  }
  static testInfiniteLoop(t) {
    let e = t, n = t;
    do {
      if (e != t && e === n)
        throw o.Errors.INFINITE_LOOP;
      e = e.next, n = n.next.next;
    } while (e != t);
  }
  get size() {
    let t = 0;
    for (let e of this)
      t++;
    return t;
  }
  toArray(t = void 0, e = void 0) {
    let n = [], i = t || this.first, s = e || this.last, a = i;
    if (a === void 0)
      return n;
    do
      n.push(a), a = a.next;
    while (a !== s.next);
    return n;
  }
  append(t) {
    return this.isEmpty() ? this.first = t : (t.prev = this.last, this.last.next = t), this.last = t, this.last.next = void 0, this.first.prev = void 0, this;
  }
  insert(t, e) {
    if (this.isEmpty())
      this.first = t, this.last = t;
    else if (e == null)
      t.next = this.first, this.first.prev = t, this.first = t;
    else {
      let n = e.next;
      e.next = t, n && (n.prev = t), t.prev = e, t.next = n, this.last === e && (this.last = t);
    }
    return this.last.next = void 0, this.first.prev = void 0, this;
  }
  remove(t) {
    return t === this.first && t === this.last ? (this.first = void 0, this.last = void 0) : (t.prev && (t.prev.next = t.next), t.next && (t.next.prev = t.prev), t === this.first && (this.first = t.next), t === this.last && (this.last = t.prev)), this;
  }
  isEmpty() {
    return this.first === void 0;
  }
  [Symbol.iterator]() {
    let t;
    return {
      next: () => (t = t ? t.next : this.first, { value: t, done: t === void 0 })
    };
  }
}
function Re(r, t, e) {
  let n = e.length, i = r.shape.split(t);
  if (i.length === 0)
    return;
  let s = 0;
  i[0] === null ? s = 0 : i[1] === null ? s = r.shape.length : s = i[0].length;
  let a = io;
  he(s, 0) && (a |= Hr), he(s, r.shape.length) && (a |= Te);
  let l = a & Te && r.next.arc_length === 0 ? 0 : r.arc_length + s;
  e.push({
    id: n,
    pt: t,
    arc_length: l,
    edge_before: r,
    edge_after: void 0,
    face: r.face,
    is_vertex: a
  });
}
function cr(r) {
  r.int_points1_sorted = or(r.int_points1), r.int_points2_sorted = or(r.int_points2);
}
function or(r) {
  let t = /* @__PURE__ */ new Map(), e = 0;
  for (let i of r)
    t.has(i.face) || (t.set(i.face, e), e++);
  for (let i of r)
    i.faceId = t.get(i.face);
  return r.slice().sort(Uf);
}
function Uf(r, t) {
  return r.faceId < t.faceId ? -1 : r.faceId > t.faceId ? 1 : r.arc_length < t.arc_length ? -1 : r.arc_length > t.arc_length ? 1 : 0;
}
function Tn(r, t) {
  return t.slice().sort((e, n) => r.coord(e.pt) < r.coord(n.pt) ? -1 : r.coord(e.pt) > r.coord(n.pt) ? 1 : 0);
}
function so(r) {
  if (r.int_points1.length < 2)
    return;
  let t = !1, e, n, i, s;
  for (let a = 0; a < r.int_points1_sorted.length; a++)
    if (r.int_points1_sorted[a].id !== -1) {
      e = r.int_points1_sorted[a], n = r.int_points2[e.id];
      for (let l = a + 1; l < r.int_points1_sorted.length && (i = r.int_points1_sorted[l], !!he(i.arc_length, e.arc_length)); l++)
        i.id !== -1 && (s = r.int_points2[i.id], s.id !== -1 && i.edge_before === e.edge_before && i.edge_after === e.edge_after && s.edge_before === n.edge_before && s.edge_after === n.edge_after && (i.id = -1, s.id = -1, t = !0));
    }
  n = r.int_points2_sorted[0], e = r.int_points1[n.id];
  for (let a = 1; a < r.int_points2_sorted.length; a++) {
    let l = r.int_points2_sorted[a];
    if (l.id == -1)
      continue;
    if (n.id == -1 || !he(l.arc_length, n.arc_length)) {
      n = l, e = r.int_points1[n.id];
      continue;
    }
    let f = r.int_points1[l.id];
    f.edge_before === e.edge_before && f.edge_after === e.edge_after && l.edge_before === n.edge_before && l.edge_after === n.edge_after && (f.id = -1, l.id = -1, t = !0);
  }
  t && (r.int_points1 = r.int_points1.filter((a) => a.id >= 0), r.int_points2 = r.int_points2.filter((a) => a.id >= 0), r.int_points1.forEach((a, l) => a.id = l), r.int_points2.forEach((a, l) => a.id = l));
}
function Si(r) {
  for (let t of r)
    t.edge_before.bvStart = void 0, t.edge_before.bvEnd = void 0, t.edge_before.bv = void 0, t.edge_before.overlap = void 0, t.edge_after.bvStart = void 0, t.edge_after.bvEnd = void 0, t.edge_after.bv = void 0, t.edge_after.overlap = void 0;
  for (let t of r)
    t.edge_before.bvEnd = Ft, t.edge_after.bvStart = Ft;
}
function Ei(r, t) {
  for (let e of r)
    e.edge_before.setInclusion(t), e.edge_after.setInclusion(t);
}
function Df(r) {
  let t, e, n, i = r.int_points1.length;
  for (let s = 0; s < i; s++) {
    let a = r.int_points1_sorted[s];
    a.face !== t && (e = s, t = a.face);
    let l = s, f = Le(r.int_points1_sorted, s, t), u;
    l + f < i && r.int_points1_sorted[l + f].face === t ? u = l + f : u = e;
    let c = Le(r.int_points1_sorted, u, t);
    n = null;
    for (let b = u; b < u + c; b++) {
      let $ = r.int_points1_sorted[b];
      if ($.face === t && r.int_points2[$.id].face === r.int_points2[a.id].face) {
        n = $;
        break;
      }
    }
    if (n === null)
      continue;
    let d = a.edge_after, g = n.edge_before;
    if (!(d.bv === Ft && g.bv === Ft) || d !== g)
      continue;
    let S = r.int_points2[a.id], m = r.int_points2[n.id], _ = S.edge_after, I = m.edge_before;
    _.bv === Ft && I.bv === Ft && _ === I || (S = r.int_points2[n.id], m = r.int_points2[a.id], _ = S.edge_after, I = m.edge_before), _.bv === Ft && I.bv === Ft && _ === I && d.setOverlap(_);
  }
}
function Le(r, t, e) {
  let n, i, s = 1;
  if (r.length == 1)
    return 1;
  n = r[t];
  for (let a = t + 1; a < r.length && !(n.face != e || (i = r[a], !(i.pt.equalTo(n.pt) && i.edge_before === n.edge_before && i.edge_after === n.edge_after))); a++)
    s++;
  return s;
}
function Ce(r, t) {
  if (!!t) {
    for (let e of t) {
      let n = e.edge_before;
      if (e.is_vertex = io, n.shape.start && n.shape.start.equalTo(e.pt) && (e.is_vertex |= Hr), n.shape.end && n.shape.end.equalTo(e.pt) && (e.is_vertex |= Te), e.is_vertex & Hr) {
        e.edge_before = n.prev, e.is_vertex = Te;
        continue;
      }
      if (e.is_vertex & Te)
        continue;
      let i = r.addVertex(e.pt, n);
      e.edge_before = i;
    }
    for (let e of t)
      e.edge_after = e.edge_before.next;
  }
}
function os(r, t, e) {
  let n = r.edge_before, i = t.edge_after;
  n.next = e, e.prev = n, e.next = i, i.prev = e;
}
const { INSIDE: jt, OUTSIDE: Ut, BOUNDARY: ct, OVERLAP_SAME: Vf, OVERLAP_OPPOSITE: Gf } = Xr, { NOT_VERTEX: tx, START_VERTEX: ss, END_VERTEX: as } = Xr, an = 1, yr = 2, de = 3;
function qf(r, t) {
  let [e, n] = mr(r, t, an, !0);
  return e;
}
function $i(r, t) {
  let n = t.clone().reverse(), [i, s] = mr(r, n, de, !0);
  return i;
}
function cl(r, t) {
  let [e, n] = mr(r, t, yr, !0);
  return e;
}
function hl(r, t) {
  let [e, n] = mr(r, t, yr, !1), i = [];
  for (let a of e.faces)
    i = [...i, ...[...a.edges].map((l) => l.shape)];
  let s = [];
  for (let a of n.faces)
    s = [...s, ...[...a.edges].map((l) => l.shape)];
  return [i, s];
}
function Oi(r, t) {
  let [e, n] = mr(r, t, de, !1), i = [];
  for (let s of e.faces)
    i = [...i, ...[...s.edges].map((a) => a.shape)];
  return i;
}
function dl(r, t) {
  let e = r.clone(), n = t.clone(), i = pl(e, n);
  cr(i), Ce(e, i.int_points1_sorted), Ce(n, i.int_points2_sorted), so(i), cr(i);
  let s = i.int_points1_sorted.map((l) => l.pt), a = i.int_points2_sorted.map((l) => l.pt);
  return [s, a];
}
function Wf(r, t, e, n) {
  let i = ls(r, e.int_points1), s = ls(t, e.int_points2);
  for (us(i, t), us(s, r), Si(e.int_points1), Si(e.int_points2), Ei(e.int_points1, t), Ei(e.int_points2, r); Yf(r, t, e.int_points1, e.int_points1_sorted, e.int_points2, e); )
    ;
  Df(e), Ii(r, n, e.int_points1_sorted, !0), Ii(t, n, e.int_points2_sorted, !1), fs(r, i, n, !0), fs(t, s, n, !1);
}
function zf(r, t, e, n) {
  Kf(r, t, n, e.int_points2), Qf(r, t, e), Pi(r, e.int_points1), Pi(t, e.int_points2), Ti(r, e.int_points1, e.int_points2), Ti(r, e.int_points2, e.int_points1);
}
function mr(r, t, e, n) {
  let i = r.clone(), s = t.clone(), a = pl(i, s);
  return cr(a), Ce(i, a.int_points1_sorted), Ce(s, a.int_points2_sorted), so(a), cr(a), Wf(i, s, a, e), n && zf(i, s, a, e), [i, s];
}
function pl(r, t) {
  let e = {
    int_points1: [],
    int_points2: []
  };
  for (let n of r.edges) {
    let i = t.edges.search(n.box);
    for (let s of i) {
      let a = n.shape.intersect(s.shape);
      for (let l of a)
        Re(n, l, e.int_points1), Re(s, l, e.int_points2);
    }
  }
  return e;
}
function ls(r, t) {
  let e = [];
  for (let n of r.faces)
    t.find((i) => i.face === n) || e.push(n);
  return e;
}
function us(r, t) {
  for (let e of r)
    e.first.bv = e.first.bvStart = e.first.bvEnd = void 0, e.first.setInclusion(t);
}
function Yf(r, t, e, n, i, s) {
  let a, l, f, u = n.length, c = !1;
  for (let d = 0; d < u; d++) {
    let g = n[d];
    g.face !== a && (l = d, a = g.face);
    let S = d, m = Le(n, d, a), _;
    S + m < u && n[S + m].face === a ? _ = S + m : _ = l;
    let I = Le(n, _, a);
    f = null;
    for (let h = _; h < _ + I; h++) {
      let p = n[h];
      if (p.face === a && i[p.id].face === i[g.id].face) {
        f = p;
        break;
      }
    }
    if (f === null)
      continue;
    let b = g.edge_after, $ = f.edge_before;
    if (b.bv === ct && $.bv != ct) {
      b.bv = $.bv;
      continue;
    }
    if (b.bv != ct && $.bv === ct) {
      $.bv = b.bv;
      continue;
    }
    if (b.bv === ct && $.bv === ct && b != $ || b.bv === jt && $.bv === Ut || b.bv === Ut && $.bv === jt) {
      let h = b.next;
      for (; h != $; )
        h.bvStart = void 0, h.bvEnd = void 0, h.bv = void 0, h.setInclusion(t), h = h.next;
    }
    if (b.bv === ct && $.bv === ct && b != $) {
      let h = b.next, p;
      for (; h != $; ) {
        if (h.bv != ct) {
          if (p === void 0)
            p = h.bv;
          else if (h.bv != p)
            throw xi.UNRESOLVED_BOUNDARY_CONFLICT;
        }
        h = h.next;
      }
      p != null && (b.bv = p, $.bv = p);
      continue;
    }
    if (b.bv === jt && $.bv === Ut || b.bv === Ut && $.bv === jt) {
      let h = b;
      for (; h != $; ) {
        if (h.bvStart === b.bv && h.bvEnd === $.bv) {
          let [p, v] = h.shape.distanceTo(t);
          if (p < 10 * o.DP_TOL) {
            Re(h, v.ps, e);
            let E = e[e.length - 1];
            if (E.is_vertex & ss)
              E.edge_after = h, E.edge_before = h.prev, h.bvStart = ct, h.bv = void 0, h.setInclusion(t);
            else if (E.is_vertex & as)
              E.edge_after = h.next, h.bvEnd = ct, h.bv = void 0, h.setInclusion(t);
            else {
              let T = t.addVertex(E.pt, h);
              E.edge_before = T, E.edge_after = T.next, T.setInclusion(t), T.next.bvStart = ct, T.next.bvEnd = void 0, T.next.bv = void 0, T.next.setInclusion(t);
            }
            let O = t.findEdgeByPoint(v.pe);
            Re(O, v.pe, i);
            let w = i[i.length - 1];
            if (w.is_vertex & ss)
              w.edge_after = O, w.edge_before = O.prev;
            else if (w.is_vertex & as)
              w.edge_after = O.next;
            else {
              let T = i.find((k) => k.edge_after === O), L = t.addVertex(w.pt, O);
              w.edge_before = L, w.edge_after = L.next, T && (T.edge_after = L), L.bvStart = void 0, L.bvEnd = ct, L.bv = void 0, L.setInclusion(r), L.next.bvStart = ct, L.next.bvEnd = void 0, L.next.bv = void 0, L.next.setInclusion(r);
            }
            cr(s), c = !0;
            break;
          }
        }
        h = h.next;
      }
      if (c)
        break;
      throw xi.UNRESOLVED_BOUNDARY_CONFLICT;
    }
  }
  return c;
}
function Ii(r, t, e, n) {
  if (!e)
    return;
  let i, s, a, l;
  for (let f = 0; f < e.length; f++) {
    if (a = e[f], a.face !== i && (s = f, i = a.face), i.isEmpty())
      continue;
    let u = f, c = Le(e, f, i), d;
    u + c < e.length && e[u + c].face === a.face ? d = u + c : d = s, l = e[d];
    let g = d, S = Le(e, g, i), m = a.edge_after, _ = l.edge_before;
    if (m.bv === jt && _.bv === jt && t === an || m.bv === Ut && _.bv === Ut && t === yr || (m.bv === Ut || _.bv === Ut) && t === de && !n || (m.bv === jt || _.bv === jt) && t === de && n || m.bv === ct && _.bv === ct && m.overlap & Vf && n || m.bv === ct && _.bv === ct && m.overlap & Gf) {
      r.removeChain(i, m, _);
      for (let I = u; I < u + c; I++)
        e[I].edge_after = void 0;
      for (let I = g; I < g + S; I++)
        e[I].edge_before = void 0;
    }
    f += c - 1;
  }
}
function Kf(r, t, e, n) {
  for (let i of t.faces) {
    for (let s of i)
      r.edges.add(s);
    n.find((s) => s.face === i) === void 0 && r.addFace(i.first, i.last);
  }
}
function Qf(r, t, e) {
  if (e.int_points1.length !== 0)
    for (let n = 0; n < e.int_points1.length; n++) {
      let i = e.int_points1[n], s = e.int_points2[n];
      if (i.edge_before !== void 0 && i.edge_after === void 0 && s.edge_before === void 0 && s.edge_after !== void 0 && (i.edge_before.next = s.edge_after, s.edge_after.prev = i.edge_before, i.edge_after = s.edge_after, s.edge_before = i.edge_before), s.edge_before !== void 0 && s.edge_after === void 0 && i.edge_before === void 0 && i.edge_after !== void 0 && (s.edge_before.next = i.edge_after, i.edge_after.prev = s.edge_before, s.edge_after = i.edge_after, i.edge_before = s.edge_before), i.edge_before !== void 0 && i.edge_after === void 0)
        for (let a of e.int_points1_sorted)
          a !== i && a.edge_before === void 0 && a.edge_after !== void 0 && a.pt.equalTo(i.pt) && (i.edge_before.next = a.edge_after, a.edge_after.prev = i.edge_before, i.edge_after = a.edge_after, a.edge_before = i.edge_before);
      if (s.edge_before !== void 0 && s.edge_after === void 0)
        for (let a of e.int_points2_sorted)
          a !== s && a.edge_before === void 0 && a.edge_after !== void 0 && a.pt.equalTo(s.pt) && (s.edge_before.next = a.edge_after, a.edge_after.prev = s.edge_before, s.edge_after = a.edge_after, a.edge_before = s.edge_before);
    }
}
function Pi(r, t) {
  for (let e of t)
    r.faces.delete(e.face), e.face = void 0, e.edge_before && (e.edge_before.face = void 0), e.edge_after && (e.edge_after.face = void 0);
}
function Ti(r, t, e) {
  for (let n of t) {
    if (n.edge_before === void 0 || n.edge_after === void 0 || n.face || n.edge_after.face || n.edge_before.face)
      continue;
    let i = n.edge_after, s = n.edge_before;
    oo.testInfiniteLoop(i);
    let a = r.addFace(i, s);
    for (let l of t)
      l.edge_before && l.edge_after && l.edge_before.face === a && l.edge_after.face === a && (l.face = a);
    for (let l of e)
      l.edge_before && l.edge_after && l.edge_before.face === a && l.edge_after.face === a && (l.face = a);
  }
}
function fs(r, t, e, n) {
  for (let i of t) {
    let s = i.first.bv;
    (e === an && s === jt || e === de && s === jt && n || e === de && s === Ut && !n || e === yr && s === Ut) && r.deleteFace(i);
  }
}
var Hf = /* @__PURE__ */ Object.freeze({
  BOOLEAN_UNION: an,
  BOOLEAN_INTERSECT: yr,
  BOOLEAN_SUBTRACT: de,
  unify: qf,
  subtract: $i,
  intersect: cl,
  innerClip: hl,
  outerClip: Oi,
  calculateIntersections: dl,
  removeNotRelevantChains: Ii,
  removeOldFaces: Pi,
  restoreFaces: Ti
});
const Xf = RegExp("T.F..FFF.|T.F...F.."), Jf = RegExp("T........|.T.......|...T.....|....T...."), Zf = RegExp("FT.......|F..T.....|F...T...."), tc = RegExp("T.F..F..."), ec = RegExp("T.F..F...|.TF..F...|..FT.F...|..F.TF...");
class Fe {
  constructor() {
    this.m = new Array(9).fill(void 0);
  }
  get I2I() {
    return this.m[0];
  }
  set I2I(t) {
    this.m[0] = t;
  }
  get I2B() {
    return this.m[1];
  }
  set I2B(t) {
    this.m[1] = t;
  }
  get I2E() {
    return this.m[2];
  }
  set I2E(t) {
    this.m[2] = t;
  }
  get B2I() {
    return this.m[3];
  }
  set B2I(t) {
    this.m[3] = t;
  }
  get B2B() {
    return this.m[4];
  }
  set B2B(t) {
    this.m[4] = t;
  }
  get B2E() {
    return this.m[5];
  }
  set B2E(t) {
    this.m[5] = t;
  }
  get E2I() {
    return this.m[6];
  }
  set E2I(t) {
    this.m[6] = t;
  }
  get E2B() {
    return this.m[7];
  }
  set E2B(t) {
    this.m[7] = t;
  }
  get E2E() {
    return this.m[8];
  }
  set E2E(t) {
    this.m[8] = t;
  }
  toString() {
    return this.m.map((t) => t instanceof Array && t.length > 0 ? "T" : t instanceof Array && t.length === 0 ? "F" : "*").join("");
  }
  equal() {
    return Xf.test(this.toString());
  }
  intersect() {
    return Jf.test(this.toString());
  }
  touch() {
    return Zf.test(this.toString());
  }
  inside() {
    return tc.test(this.toString());
  }
  covered() {
    return ec.test(this.toString());
  }
}
function ln(r, t) {
  let e = [], [n, i, s] = r.standard, [a, l, f] = t.standard, u = n * l - i * a, c = s * l - i * f, d = n * f - s * a;
  if (!o.Utils.EQ_0(u)) {
    let g, S;
    i === 0 ? (g = s / n, S = d / u) : l === 0 ? (g = f / a, S = d / u) : n === 0 ? (g = c / u, S = s / i) : a === 0 ? (g = c / u, S = f / l) : (g = c / u, S = d / u), e.push(new o.Point(g, S));
  }
  return e;
}
function Be(r, t) {
  let e = [], n = t.pc.projectionOn(r), i = t.pc.distanceTo(n)[0];
  if (o.Utils.EQ(i, t.r))
    e.push(n);
  else if (o.Utils.LT(i, t.r)) {
    let s = Math.sqrt(t.r * t.r - i * i), a, l;
    a = r.norm.rotate90CCW().multiply(s), l = n.translate(a), e.push(l), a = r.norm.rotate90CW().multiply(s), l = n.translate(a), e.push(l);
  }
  return e;
}
function hr(r, t) {
  let e = [];
  for (let n of t.toSegments()) {
    let i = un(n, r);
    for (let s of i)
      ml(s, e) || e.push(s);
  }
  return e;
}
function ao(r, t) {
  let e = [];
  if (hr(r, t.box).length === 0)
    return e;
  let n = new o.Circle(t.pc, t.r), i = Be(r, n);
  for (let s of i)
    s.on(t) && e.push(s);
  return e;
}
function un(r, t) {
  let e = [];
  if (r.ps.on(t) && e.push(r.ps), r.pe.on(t) && !r.isZeroLength() && e.push(r.pe), e.length > 0 || r.isZeroLength() || r.ps.leftTo(t) && r.pe.leftTo(t) || !r.ps.leftTo(t) && !r.pe.leftTo(t))
    return e;
  let n = new o.Line(r.ps, r.pe);
  return ln(n, t);
}
function _r(r, t) {
  let e = [];
  if (r.box.not_intersect(t.box))
    return e;
  if (r.isZeroLength())
    return r.ps.on(t) && e.push(r.ps), e;
  if (t.isZeroLength())
    return t.ps.on(r) && e.push(t.ps), e;
  let n = new o.Line(r.ps, r.pe), i = new o.Line(t.ps, t.pe);
  if (n.incidentTo(i))
    r.ps.on(t) && e.push(r.ps), r.pe.on(t) && e.push(r.pe), t.ps.on(r) && !t.ps.equalTo(r.ps) && !t.ps.equalTo(r.pe) && e.push(t.ps), t.pe.on(r) && !t.pe.equalTo(r.ps) && !t.pe.equalTo(r.pe) && e.push(t.pe);
  else {
    let s = ln(n, i);
    s.length > 0 && s[0].on(r) && s[0].on(t) && e.push(s[0]);
  }
  return e;
}
function fn(r, t) {
  let e = [];
  if (r.box.not_intersect(t.box))
    return e;
  if (r.isZeroLength()) {
    let [s, a] = r.ps.distanceTo(t.pc);
    return o.Utils.EQ(s, t.r) && e.push(r.ps), e;
  }
  let n = new o.Line(r.ps, r.pe), i = Be(n, t);
  for (let s of i)
    s.on(r) && e.push(s);
  return e;
}
function pe(r, t) {
  let e = [];
  if (r.box.not_intersect(t.box))
    return e;
  if (r.isZeroLength())
    return r.ps.on(t) && e.push(r.ps), e;
  let n = new o.Line(r.ps, r.pe), i = new o.Circle(t.pc, t.r), s = Be(n, i);
  for (let a of s)
    a.on(r) && a.on(t) && e.push(a);
  return e;
}
function rc(r, t) {
  let e = [];
  for (let n of t.toSegments()) {
    let i = _r(n, r);
    for (let s of i)
      e.push(s);
  }
  return e;
}
function vl(r, t) {
  let e = [];
  if (r.box.not_intersect(t.box))
    return e;
  let n = new o.Vector(r.pc, t.pc), i = r.r, s = t.r;
  if (o.Utils.EQ_0(i) || o.Utils.EQ_0(s))
    return e;
  if (o.Utils.EQ_0(n.x) && o.Utils.EQ_0(n.y) && o.Utils.EQ(i, s))
    return e.push(r.pc.translate(-i, 0)), e;
  let a = r.pc.distanceTo(t.pc)[0];
  if (o.Utils.GT(a, i + s) || o.Utils.LT(a, Math.abs(i - s)))
    return e;
  n.x /= a, n.y /= a;
  let l;
  if (o.Utils.EQ(a, i + s) || o.Utils.EQ(a, Math.abs(i - s)))
    return l = r.pc.translate(i * n.x, i * n.y), e.push(l), e;
  let f = i * i / (2 * a) - s * s / (2 * a) + a / 2, u = r.pc.translate(f * n.x, f * n.y), c = Math.sqrt(i * i - f * f);
  return l = u.translate(n.rotate90CCW().multiply(c)), e.push(l), l = u.translate(n.rotate90CW().multiply(c)), e.push(l), e;
}
function nc(r, t) {
  let e = [];
  for (let n of t.toSegments()) {
    let i = fn(n, r);
    for (let s of i)
      e.push(s);
  }
  return e;
}
function lo(r, t) {
  var e = [];
  if (r.box.not_intersect(t.box))
    return e;
  if (r.pc.equalTo(t.pc) && o.Utils.EQ(r.r, t.r)) {
    let a;
    return a = r.start, a.on(t) && e.push(a), a = r.end, a.on(t) && e.push(a), a = t.start, a.on(r) && e.push(a), a = t.end, a.on(r) && e.push(a), e;
  }
  let n = new o.Circle(r.pc, r.r), i = new o.Circle(t.pc, t.r), s = n.intersect(i);
  for (let a of s)
    a.on(r) && a.on(t) && e.push(a);
  return e;
}
function uo(r, t) {
  let e = [];
  if (r.box.not_intersect(t.box))
    return e;
  if (t.pc.equalTo(r.pc) && o.Utils.EQ(t.r, r.r))
    return e.push(r.start), e.push(r.end), e;
  let n = t, i = new o.Circle(r.pc, r.r), s = vl(n, i);
  for (let a of s)
    a.on(r) && e.push(a);
  return e;
}
function ic(r, t) {
  let e = [];
  for (let n of t.toSegments()) {
    let i = pe(n, r);
    for (let s of i)
      e.push(s);
  }
  return e;
}
function oc(r, t) {
  return r.isSegment() ? _r(r.shape, t) : pe(t, r.shape);
}
function sc(r, t) {
  return r.isSegment() ? pe(r.shape, t) : lo(r.shape, t);
}
function gl(r, t) {
  return r.isSegment() ? un(r.shape, t) : ao(t, r.shape);
}
function ac(r, t) {
  return r.isSegment() ? fn(r.shape, t) : uo(r.shape, t);
}
function fo(r, t) {
  let e = [];
  for (let n of t.edges)
    for (let i of oc(n, r))
      e.push(i);
  return e;
}
function co(r, t) {
  let e = [];
  for (let n of t.edges)
    for (let i of sc(n, r))
      e.push(i);
  return e;
}
function cn(r, t) {
  let e = [];
  if (t.isEmpty())
    return e;
  for (let n of t.edges)
    for (let i of gl(n, r))
      ml(i, e) || e.push(i);
  return r.sortPoints(e);
}
function yl(r, t) {
  let e = [];
  if (t.isEmpty())
    return e;
  for (let n of t.edges)
    for (let i of ac(n, r))
      e.push(i);
  return e;
}
function lc(r, t) {
  const e = r.shape, n = t.shape;
  return r.isSegment() ? t.isSegment() ? _r(e, n) : pe(e, n) : t.isSegment() ? pe(n, e) : lo(e, n);
}
function uc(r, t) {
  let e = [];
  if (t.isEmpty() || r.shape.box.not_intersect(t.box))
    return e;
  let n = t.edges.search(r.shape.box);
  for (let i of n)
    for (let s of lc(r, i))
      e.push(s);
  return e;
}
function fc(r, t) {
  let e = [];
  if (r.isEmpty() || t.isEmpty() || r.box.not_intersect(t.box))
    return e;
  for (let n of r.edges)
    for (let i of uc(n, t))
      e.push(i);
  return e;
}
function cc(r, t) {
  return r instanceof o.Line ? cn(r, t) : r instanceof o.Segment ? fo(r, t) : r instanceof o.Arc ? co(r, t) : [];
}
function ml(r, t) {
  return t.some((e) => e.equalTo(r));
}
class kt extends oo {
  constructor(...t) {
    if (super(), t.length !== 0 && t.length == 1 && t[0] instanceof Array) {
      let e = t[0];
      if (e.length == 0)
        return;
      e.every((n) => n instanceof o.Segment || n instanceof o.Arc || n instanceof o.Ray || n instanceof o.Line);
      for (let n of e) {
        let i = new o.Edge(n);
        this.append(i);
      }
    }
  }
  get edges() {
    return [...this];
  }
  get box() {
    return this.edges.reduce((t, e) => t = t.merge(e.box), new o.Box());
  }
  get vertices() {
    let t = this.edges.map((e) => e.start);
    return t.push(this.last.end), t;
  }
  clone() {
    return new kt(this.toShapes());
  }
  addVertex(t, e) {
    let n = e.shape.split(t);
    if (n[0] === null)
      return e.prev;
    if (n[1] === null)
      return e;
    let i = new o.Edge(n[0]), s = e.prev;
    return this.insert(i, s), e.shape = n[1], i;
  }
  split(t) {
    for (let e of t) {
      let n = this.findEdgeByPoint(e);
      this.addVertex(e, n);
    }
    return this;
  }
  findEdgeByPoint(t) {
    let e;
    for (let n of this)
      if (n.shape.contains(t)) {
        e = n;
        break;
      }
    return e;
  }
  translate(t) {
    return new kt(this.edges.map((e) => e.shape.translate(t)));
  }
  rotate(t = 0, e = new o.Point()) {
    return new kt(this.edges.map((n) => n.shape.rotate(t, e)));
  }
  transform(t = new o.Matrix()) {
    return new kt(this.edges.map((e) => e.shape.transform(t)));
  }
  toShapes() {
    return this.edges.map((t) => t.shape.clone());
  }
  toJSON() {
    return this.edges.map((t) => t.toJSON());
  }
  svg(t = {}) {
    let { stroke: e, strokeWidth: n, fill: i, fillRule: s, fillOpacity: a, id: l, className: f } = t, u = l && l.length > 0 ? `id="${l}"` : "", c = f && f.length > 0 ? `class="${f}"` : "", d = `
<path stroke="${e || "black"}" stroke-width="${n || 1}" fill="${i || "none"}" fill-opacity="${a || 1}" ${u} ${c} d="`;
    d += `
M${this.first.start.x},${this.first.start.y}`;
    for (let g of this)
      d += g.svg();
    return d += `" >
</path>`, d;
  }
}
o.Multiline = kt;
const hc = (...r) => new o.Multiline(...r);
o.multiline = hc;
function sr(r, t) {
  let e, n = new o.Ray(t), i = new o.Line(n.pt, n.norm);
  const s = new o.Box(
    n.box.xmin - o.DP_TOL,
    n.box.ymin - o.DP_TOL,
    n.box.xmax,
    n.box.ymax + o.DP_TOL
  );
  if (r.box.not_intersect(s))
    return o.OUTSIDE;
  let a = r.edges.search(s);
  if (a.length == 0)
    return o.OUTSIDE;
  for (let u of a)
    if (u.shape.contains(t))
      return o.BOUNDARY;
  let l = [];
  for (let u of a)
    for (let c of n.intersect(u.shape)) {
      if (c.equalTo(t))
        return o.BOUNDARY;
      l.push({
        pt: c,
        edge: u
      });
    }
  l.sort((u, c) => fl(u.pt.x, c.pt.x) ? -1 : ul(u.pt.x, c.pt.x) ? 1 : 0);
  let f = 0;
  for (let u = 0; u < l.length; u++) {
    let c = l[u];
    if (c.pt.equalTo(c.edge.shape.start)) {
      if (u > 0 && c.pt.equalTo(l[u - 1].pt) && c.edge.prev === l[u - 1].edge)
        continue;
      let d = c.edge.prev;
      for (; wi(d.length); )
        d = d.prev;
      let g = d.shape.tangentInEnd(), S = c.pt.translate(g), m = c.edge.shape.tangentInStart(), _ = c.pt.translate(m), I = S.leftTo(i), b = _.leftTo(i);
      (I && !b || !I && b) && f++;
    } else if (c.pt.equalTo(c.edge.shape.end)) {
      if (u > 0 && c.pt.equalTo(l[u - 1].pt) && c.edge.next === l[u - 1].edge)
        continue;
      let d = c.edge.next;
      for (; wi(d.length); )
        d = d.next;
      let g = d.shape.tangentInStart(), S = c.pt.translate(g), m = c.edge.shape.tangentInEnd(), _ = c.pt.translate(m), I = S.leftTo(i), b = _.leftTo(i);
      (I && !b || !I && b) && f++;
    } else if (c.edge.shape instanceof o.Segment)
      f++;
    else {
      let d = c.edge.shape.box;
      he(c.pt.y, d.ymin) || he(c.pt.y, d.ymax) || f++;
    }
  }
  return e = f % 2 == 1 ? ir : sl, e;
}
function dc(r, t) {
  return je(r, t).equal();
}
function _l(r, t) {
  return je(r, t).intersect();
}
function pc(r, t) {
  return je(r, t).touch();
}
function vc(r, t) {
  return !_l(r, t);
}
function bl(r, t) {
  return je(r, t).inside();
}
function wl(r, t) {
  return je(r, t).covered();
}
function gc(r, t) {
  return bl(t, r);
}
function xl(r, t) {
  return wl(t, r);
}
function je(r, t) {
  if (r instanceof o.Line && t instanceof o.Line)
    return yc(r, t);
  if (r instanceof o.Line && t instanceof o.Circle)
    return mc(r, t);
  if (r instanceof o.Line && t instanceof o.Box)
    return _c(r, t);
  if (r instanceof o.Line && t instanceof o.Polygon)
    return bc(r, t);
  if ((r instanceof o.Segment || r instanceof o.Arc) && t instanceof o.Polygon)
    return cs(r, t);
  if ((r instanceof o.Segment || r instanceof o.Arc) && (t instanceof o.Circle || t instanceof o.Box))
    return cs(r, new o.Polygon(t));
  if (r instanceof o.Polygon && t instanceof o.Polygon)
    return Rr(r, t);
  if ((r instanceof o.Circle || r instanceof o.Box) && (t instanceof o.Circle || t instanceof o.Box))
    return Rr(new o.Polygon(r), new o.Polygon(t));
  if ((r instanceof o.Circle || r instanceof o.Box) && t instanceof o.Polygon)
    return Rr(new o.Polygon(r), t);
  if (r instanceof o.Polygon && (t instanceof o.Circle || t instanceof o.Box))
    return Rr(r, new o.Polygon(t));
}
function yc(r, t) {
  let e = new Fe(), n = ln(r, t);
  return n.length === 0 ? r.contains(t.pt) && t.contains(r.pt) ? (e.I2I = [r], e.I2E = [], e.E2I = []) : (e.I2I = [], e.I2E = [r], e.E2I = [t]) : (e.I2I = n, e.I2E = r.split(n), e.E2I = t.split(n)), e;
}
function mc(r, t) {
  let e = new Fe(), n = Be(r, t);
  if (n.length === 0)
    e.I2I = [], e.I2B = [], e.I2E = [r], e.E2I = [t];
  else if (n.length === 1)
    e.I2I = [], e.I2B = n, e.I2E = r.split(n), e.E2I = [t];
  else {
    let i = new kt([r]), s = r.sortPoints(n);
    i.split(s);
    let a = i.toShapes();
    e.I2I = [a[1]], e.I2B = s, e.I2E = [a[0], a[2]], e.E2I = new o.Polygon([t.toArc()]).cut(i);
  }
  return e;
}
function _c(r, t) {
  let e = new Fe(), n = hr(r, t);
  if (n.length === 0)
    e.I2I = [], e.I2B = [], e.I2E = [r], e.E2I = [t];
  else if (n.length === 1)
    e.I2I = [], e.I2B = n, e.I2E = r.split(n), e.E2I = [t];
  else {
    let i = new kt([r]), s = r.sortPoints(n);
    i.split(s);
    let a = i.toShapes();
    t.toSegments().some((l) => l.contains(n[0]) && l.contains(n[1])) ? (e.I2I = [], e.I2B = [a[1]], e.I2E = [a[0], a[2]], e.E2I = [t]) : (e.I2I = [a[1]], e.I2B = s, e.I2E = [a[0], a[2]], e.E2I = new o.Polygon(t.toSegments()).cut(i));
  }
  return e;
}
function bc(r, t) {
  let e = new Fe(), n = cn(r, t), i = new kt([r]), s = n.length > 0 ? n.slice() : r.sortPoints(n);
  return i.split(s), [...i].forEach((a) => a.setInclusion(t)), e.I2I = [...i].filter((a) => a.bv === o.INSIDE).map((a) => a.shape), e.I2B = [...i].slice(1).map((a) => a.bv === o.BOUNDARY ? a.shape : a.shape.start), e.I2E = [...i].filter((a) => a.bv === o.OUTSIDE).map((a) => a.shape), e.E2I = t.cut(i), e;
}
function cs(r, t) {
  let e = new Fe(), n = cc(r, t), i = n.length > 0 ? n.slice() : r.sortPoints(n), s = new kt([r]);
  s.split(i), [...s].forEach((a) => a.setInclusion(t)), e.I2I = [...s].filter((a) => a.bv === o.INSIDE).map((a) => a.shape), e.I2B = [...s].slice(1).map((a) => a.bv === o.BOUNDARY ? a.shape : a.shape.start), e.I2E = [...s].filter((a) => a.bv === o.OUTSIDE).map((a) => a.shape), e.B2I = [], e.B2B = [], e.B2E = [];
  for (let a of [r.start, r.end])
    switch (sr(t, a)) {
      case o.INSIDE:
        e.B2I.push(a);
        break;
      case o.BOUNDARY:
        e.B2B.push(a);
        break;
      case o.OUTSIDE:
        e.B2E.push(a);
        break;
    }
  return e;
}
function Rr(r, t) {
  let e = new Fe(), [n, i] = dl(r, t), s = cl(r, t), a = $i(r, t), l = $i(t, r), [f, u] = hl(r, t), c = Oi(r, t), d = Oi(t, r);
  return e.I2I = s.isEmpty() ? [] : [s], e.I2B = u, e.I2E = a.isEmpty() ? [] : [a], e.B2I = f, e.B2B = n, e.B2E = c, e.E2I = l.isEmpty() ? [] : [l], e.E2B = d, e;
}
var wc = /* @__PURE__ */ Object.freeze({
  equal: dc,
  intersect: _l,
  touch: pc,
  disjoint: vc,
  inside: bl,
  covered: wl,
  contain: gc,
  cover: xl,
  relate: je
});
class le {
  constructor(t = 1, e = 0, n = 0, i = 1, s = 0, a = 0) {
    this.a = t, this.b = e, this.c = n, this.d = i, this.tx = s, this.ty = a;
  }
  clone() {
    return new le(this.a, this.b, this.c, this.d, this.tx, this.ty);
  }
  transform(t) {
    return [
      t[0] * this.a + t[1] * this.c + this.tx,
      t[0] * this.b + t[1] * this.d + this.ty
    ];
  }
  multiply(t) {
    return new le(
      this.a * t.a + this.c * t.b,
      this.b * t.a + this.d * t.b,
      this.a * t.c + this.c * t.d,
      this.b * t.c + this.d * t.d,
      this.a * t.tx + this.c * t.ty + this.tx,
      this.b * t.tx + this.d * t.ty + this.ty
    );
  }
  translate(...t) {
    let e, n;
    if (t.length == 1 && t[0] instanceof o.Vector)
      e = t[0].x, n = t[0].y;
    else if (t.length == 2 && typeof t[0] == "number" && typeof t[1] == "number")
      e = t[0], n = t[1];
    else
      throw o.Errors.ILLEGAL_PARAMETERS;
    return this.multiply(new le(1, 0, 0, 1, e, n));
  }
  rotate(t) {
    let e = Math.cos(t), n = Math.sin(t);
    return this.multiply(new le(e, n, -n, e, 0, 0));
  }
  scale(t, e) {
    return this.multiply(new le(t, 0, 0, e, 0, 0));
  }
  equalTo(t) {
    return !(!o.Utils.EQ(this.tx, t.tx) || !o.Utils.EQ(this.ty, t.ty) || !o.Utils.EQ(this.a, t.a) || !o.Utils.EQ(this.b, t.b) || !o.Utils.EQ(this.c, t.c) || !o.Utils.EQ(this.d, t.d));
  }
}
o.Matrix = le;
const xc = (...r) => new o.Matrix(...r);
o.matrix = xc;
const Sc = class Ai {
  constructor(t, e) {
    this.low = t, this.high = e;
  }
  clone() {
    return new Ai(this.low, this.high);
  }
  get max() {
    return this.clone();
  }
  less_than(t) {
    return this.low < t.low || this.low == t.low && this.high < t.high;
  }
  equal_to(t) {
    return this.low == t.low && this.high == t.high;
  }
  intersect(t) {
    return !this.not_intersect(t);
  }
  not_intersect(t) {
    return this.high < t.low || t.high < this.low;
  }
  merge(t) {
    return new Ai(
      this.low === void 0 ? t.low : Math.min(this.low, t.low),
      this.high === void 0 ? t.high : Math.max(this.high, t.high)
    );
  }
  output() {
    return [this.low, this.high];
  }
  static comparable_max(t, e) {
    return t.merge(e);
  }
  static comparable_less_than(t, e) {
    return t < e;
  }
}, pt = 0, q = 1;
class we {
  constructor(t = void 0, e = void 0, n = null, i = null, s = null, a = q) {
    this.left = n, this.right = i, this.parent = s, this.color = a, this.item = { key: t, value: e }, t && t instanceof Array && t.length == 2 && !Number.isNaN(t[0]) && !Number.isNaN(t[1]) && (this.item.key = new Sc(Math.min(t[0], t[1]), Math.max(t[0], t[1]))), this.max = this.item.key ? this.item.key.max : void 0;
  }
  isNil() {
    return this.item.key === void 0 && this.item.value === void 0 && this.left === null && this.right === null && this.color === q;
  }
  less_than(t) {
    if (this.item.value === this.item.key && t.item.value === t.item.key)
      return this.item.key.less_than(t.item.key);
    {
      let e = this.item.value && t.item.value && this.item.value.less_than ? this.item.value.less_than(t.item.value) : this.item.value < t.item.value;
      return this.item.key.less_than(t.item.key) || this.item.key.equal_to(t.item.key) && e;
    }
  }
  equal_to(t) {
    if (this.item.value === this.item.key && t.item.value === t.item.key)
      return this.item.key.equal_to(t.item.key);
    {
      let e = this.item.value && t.item.value && this.item.value.equal_to ? this.item.value.equal_to(t.item.value) : this.item.value == t.item.value;
      return this.item.key.equal_to(t.item.key) && e;
    }
  }
  intersect(t) {
    return this.item.key.intersect(t.item.key);
  }
  copy_data(t) {
    this.item.key = t.item.key, this.item.value = t.item.value;
  }
  update_max() {
    if (this.max = this.item.key ? this.item.key.max : void 0, this.right && this.right.max) {
      const t = this.item.key.constructor.comparable_max;
      this.max = t(this.max, this.right.max);
    }
    if (this.left && this.left.max) {
      const t = this.item.key.constructor.comparable_max;
      this.max = t(this.max, this.left.max);
    }
  }
  not_intersect_left_subtree(t) {
    const e = this.item.key.constructor.comparable_less_than;
    let n = this.left.max.high !== void 0 ? this.left.max.high : this.left.max;
    return e(n, t.item.key.low);
  }
  not_intersect_right_subtree(t) {
    const e = this.item.key.constructor.comparable_less_than;
    let n = this.right.max.low !== void 0 ? this.right.max.low : this.right.item.key.low;
    return e(t.item.key.high, n);
  }
}
class dr {
  constructor() {
    this.root = null, this.nil_node = new we();
  }
  get size() {
    let t = 0;
    return this.tree_walk(this.root, () => t++), t;
  }
  get keys() {
    let t = [];
    return this.tree_walk(this.root, (e) => t.push(
      e.item.key.output ? e.item.key.output() : e.item.key
    )), t;
  }
  get values() {
    let t = [];
    return this.tree_walk(this.root, (e) => t.push(e.item.value)), t;
  }
  get items() {
    let t = [];
    return this.tree_walk(this.root, (e) => t.push({
      key: e.item.key.output ? e.item.key.output() : e.item.key,
      value: e.item.value
    })), t;
  }
  isEmpty() {
    return this.root == null || this.root == this.nil_node;
  }
  clear() {
    this.root = null;
  }
  insert(t, e = t) {
    if (t === void 0)
      return;
    let n = new we(t, e, this.nil_node, this.nil_node, null, pt);
    return this.tree_insert(n), this.recalc_max(n), n;
  }
  exist(t, e = t) {
    let n = new we(t, e);
    return !!this.tree_search(this.root, n);
  }
  remove(t, e = t) {
    let n = new we(t, e), i = this.tree_search(this.root, n);
    return i && this.tree_delete(i), i;
  }
  search(t, e = (n, i) => n === i ? i.output() : n) {
    let n = new we(t), i = [];
    return this.tree_search_interval(this.root, n, i), i.map((s) => e(s.item.value, s.item.key));
  }
  intersect_any(t) {
    let e = new we(t);
    return this.tree_find_any_interval(this.root, e);
  }
  forEach(t) {
    this.tree_walk(this.root, (e) => t(e.item.key, e.item.value));
  }
  map(t) {
    const e = new dr();
    return this.tree_walk(this.root, (n) => e.insert(n.item.key, t(n.item.value, n.item.key))), e;
  }
  recalc_max(t) {
    let e = t;
    for (; e.parent != null; )
      e.parent.update_max(), e = e.parent;
  }
  tree_insert(t) {
    let e = this.root, n = null;
    if (this.root == null || this.root == this.nil_node)
      this.root = t;
    else {
      for (; e != this.nil_node; )
        n = e, t.less_than(e) ? e = e.left : e = e.right;
      t.parent = n, t.less_than(n) ? n.left = t : n.right = t;
    }
    this.insert_fixup(t);
  }
  insert_fixup(t) {
    let e, n;
    for (e = t; e != this.root && e.parent.color == pt; )
      e.parent == e.parent.parent.left ? (n = e.parent.parent.right, n.color == pt ? (e.parent.color = q, n.color = q, e.parent.parent.color = pt, e = e.parent.parent) : (e == e.parent.right && (e = e.parent, this.rotate_left(e)), e.parent.color = q, e.parent.parent.color = pt, this.rotate_right(e.parent.parent))) : (n = e.parent.parent.left, n.color == pt ? (e.parent.color = q, n.color = q, e.parent.parent.color = pt, e = e.parent.parent) : (e == e.parent.left && (e = e.parent, this.rotate_right(e)), e.parent.color = q, e.parent.parent.color = pt, this.rotate_left(e.parent.parent)));
    this.root.color = q;
  }
  tree_delete(t) {
    let e, n;
    t.left == this.nil_node || t.right == this.nil_node ? e = t : e = this.tree_successor(t), e.left != this.nil_node ? n = e.left : n = e.right, n.parent = e.parent, e == this.root ? this.root = n : (e == e.parent.left ? e.parent.left = n : e.parent.right = n, e.parent.update_max()), this.recalc_max(n), e != t && (t.copy_data(e), t.update_max(), this.recalc_max(t)), e.color == q && this.delete_fixup(n);
  }
  delete_fixup(t) {
    let e = t, n;
    for (; e != this.root && e.parent != null && e.color == q; )
      e == e.parent.left ? (n = e.parent.right, n.color == pt && (n.color = q, e.parent.color = pt, this.rotate_left(e.parent), n = e.parent.right), n.left.color == q && n.right.color == q ? (n.color = pt, e = e.parent) : (n.right.color == q && (n.color = pt, n.left.color = q, this.rotate_right(n), n = e.parent.right), n.color = e.parent.color, e.parent.color = q, n.right.color = q, this.rotate_left(e.parent), e = this.root)) : (n = e.parent.left, n.color == pt && (n.color = q, e.parent.color = pt, this.rotate_right(e.parent), n = e.parent.left), n.left.color == q && n.right.color == q ? (n.color = pt, e = e.parent) : (n.left.color == q && (n.color = pt, n.right.color = q, this.rotate_left(n), n = e.parent.left), n.color = e.parent.color, e.parent.color = q, n.left.color = q, this.rotate_right(e.parent), e = this.root));
    e.color = q;
  }
  tree_search(t, e) {
    if (!(t == null || t == this.nil_node))
      return e.equal_to(t) ? t : e.less_than(t) ? this.tree_search(t.left, e) : this.tree_search(t.right, e);
  }
  tree_search_interval(t, e, n) {
    t != null && t != this.nil_node && (t.left != this.nil_node && !t.not_intersect_left_subtree(e) && this.tree_search_interval(t.left, e, n), t.intersect(e) && n.push(t), t.right != this.nil_node && !t.not_intersect_right_subtree(e) && this.tree_search_interval(t.right, e, n));
  }
  tree_find_any_interval(t, e) {
    let n = !1;
    return t != null && t != this.nil_node && (t.left != this.nil_node && !t.not_intersect_left_subtree(e) && (n = this.tree_find_any_interval(t.left, e)), n || (n = t.intersect(e)), !n && t.right != this.nil_node && !t.not_intersect_right_subtree(e) && (n = this.tree_find_any_interval(t.right, e))), n;
  }
  local_minimum(t) {
    let e = t;
    for (; e.left != null && e.left != this.nil_node; )
      e = e.left;
    return e;
  }
  local_maximum(t) {
    let e = t;
    for (; e.right != null && e.right != this.nil_node; )
      e = e.right;
    return e;
  }
  tree_successor(t) {
    let e, n, i;
    if (t.right != this.nil_node)
      e = this.local_minimum(t.right);
    else {
      for (n = t, i = t.parent; i != null && i.right == n; )
        n = i, i = i.parent;
      e = i;
    }
    return e;
  }
  rotate_left(t) {
    let e = t.right;
    t.right = e.left, e.left != this.nil_node && (e.left.parent = t), e.parent = t.parent, t == this.root ? this.root = e : t == t.parent.left ? t.parent.left = e : t.parent.right = e, e.left = t, t.parent = e, t != null && t != this.nil_node && t.update_max(), e = t.parent, e != null && e != this.nil_node && e.update_max();
  }
  rotate_right(t) {
    let e = t.left;
    t.left = e.right, e.right != this.nil_node && (e.right.parent = t), e.parent = t.parent, t == this.root ? this.root = e : t == t.parent.left ? t.parent.left = e : t.parent.right = e, e.right = t, t.parent = e, t != null && t != this.nil_node && t.update_max(), e = t.parent, e != null && e != this.nil_node && e.update_max();
  }
  tree_walk(t, e) {
    t != null && t != this.nil_node && (this.tree_walk(t.left, e), e(t), this.tree_walk(t.right, e));
  }
  testRedBlackProperty() {
    let t = !0;
    return this.tree_walk(this.root, function(e) {
      e.color == pt && (e.left.color == q && e.right.color == q || (t = !1));
    }), t;
  }
  testBlackHeightProperty(t) {
    let e = 0, n = 0, i = 0;
    if (t.color == q && e++, t.left != this.nil_node ? n = this.testBlackHeightProperty(t.left) : n = 1, t.right != this.nil_node ? i = this.testBlackHeightProperty(t.right) : i = 1, n != i)
      throw new Error("Red-black height property violated");
    return e += n, e;
  }
}
class Ec extends Set {
  constructor(t) {
    super(t), this.index = new dr(), this.forEach((e) => this.index.insert(e));
  }
  add(t) {
    let e = this.size;
    return super.add(t), this.size > e && this.index.insert(t.box, t), this;
  }
  delete(t) {
    let e = super.delete(t);
    return e && this.index.remove(t.box, t), e;
  }
  clear() {
    super.clear(), this.index = new dr();
  }
  search(t) {
    return this.index.search(t);
  }
  hit(t) {
    let e = new o.Box(t.x - 1, t.y - 1, t.x + 1, t.y + 1);
    return this.index.search(e).filter((i) => t.on(i));
  }
  svg() {
    return [...this].reduce((e, n) => e + n.svg(), "");
  }
}
o.PlanarSet = Ec;
class ho {
  constructor(...t) {
    if (this.x = 0, this.y = 0, t.length !== 0) {
      if (t.length === 1 && t[0] instanceof Array && t[0].length === 2) {
        let e = t[0];
        if (typeof e[0] == "number" && typeof e[1] == "number") {
          this.x = e[0], this.y = e[1];
          return;
        }
      }
      if (t.length === 1 && t[0] instanceof Object && t[0].name === "point") {
        let { x: e, y: n } = t[0];
        this.x = e, this.y = n;
        return;
      }
      if (t.length === 2 && typeof t[0] == "number" && typeof t[1] == "number") {
        this.x = t[0], this.y = t[1];
        return;
      }
      throw o.Errors.ILLEGAL_PARAMETERS;
    }
  }
  get box() {
    return new o.Box(this.x, this.y, this.x, this.y);
  }
  clone() {
    return new o.Point(this.x, this.y);
  }
  get vertices() {
    return [this.clone()];
  }
  equalTo(t) {
    return o.Utils.EQ(this.x, t.x) && o.Utils.EQ(this.y, t.y);
  }
  lessThan(t) {
    return !!(o.Utils.LT(this.y, t.y) || o.Utils.EQ(this.y, t.y) && o.Utils.LT(this.x, t.x));
  }
  rotate(t, e = { x: 0, y: 0 }) {
    var n = e.x + (this.x - e.x) * Math.cos(t) - (this.y - e.y) * Math.sin(t), i = e.y + (this.x - e.x) * Math.sin(t) + (this.y - e.y) * Math.cos(t);
    return new o.Point(n, i);
  }
  translate(...t) {
    if (t.length == 1 && (t[0] instanceof o.Vector || !isNaN(t[0].x) && !isNaN(t[0].y)))
      return new o.Point(this.x + t[0].x, this.y + t[0].y);
    if (t.length == 2 && typeof t[0] == "number" && typeof t[1] == "number")
      return new o.Point(this.x + t[0], this.y + t[1]);
    throw o.Errors.ILLEGAL_PARAMETERS;
  }
  transform(t) {
    return new o.Point(t.transform([this.x, this.y]));
  }
  projectionOn(t) {
    if (this.equalTo(t.pt))
      return this.clone();
    let e = new o.Vector(this, t.pt);
    if (o.Utils.EQ_0(e.cross(t.norm)))
      return t.pt.clone();
    let n = e.dot(t.norm), i = t.norm.multiply(n);
    return this.translate(i);
  }
  leftTo(t) {
    let e = new o.Vector(t.pt, this);
    return o.Utils.GT(e.dot(t.norm), 0);
  }
  distanceTo(t) {
    if (t instanceof ho) {
      let e = t.x - this.x, n = t.y - this.y;
      return [Math.sqrt(e * e + n * n), new o.Segment(this, t)];
    }
    if (t instanceof o.Line)
      return o.Distance.point2line(this, t);
    if (t instanceof o.Circle)
      return o.Distance.point2circle(this, t);
    if (t instanceof o.Segment)
      return o.Distance.point2segment(this, t);
    if (t instanceof o.Arc)
      return o.Distance.point2arc(this, t);
    if (t instanceof o.Polygon)
      return o.Distance.point2polygon(this, t);
    if (t instanceof o.PlanarSet)
      return o.Distance.shape2planarSet(this, t);
  }
  on(t) {
    if (t instanceof o.Point)
      return this.equalTo(t);
    if (t instanceof o.Line)
      return t.contains(this);
    if (t instanceof o.Circle)
      return t.contains(this);
    if (t instanceof o.Segment)
      return t.contains(this);
    if (t instanceof o.Arc)
      return t.contains(this);
    if (t instanceof o.Polygon)
      return t.contains(this);
  }
  toJSON() {
    return Object.assign({}, this, { name: "point" });
  }
  svg(t = {}) {
    let { r: e, stroke: n, strokeWidth: i, fill: s, id: a, className: l } = t, f = a && a.length > 0 ? `id="${a}"` : "", u = l && l.length > 0 ? `class="${l}"` : "";
    return `
<circle cx="${this.x}" cy="${this.y}" r="${e || 3}" stroke="${n || "black"}" stroke-width="${i || 1}" fill="${s || "red"}" ${f} ${u} />`;
  }
}
o.Point = ho;
const $c = (...r) => new o.Point(...r);
o.point = $c;
class Oc {
  constructor(...t) {
    if (this.x = 0, this.y = 0, t.length !== 0) {
      if (t.length === 1 && t[0] instanceof Array && t[0].length === 2) {
        let e = t[0];
        if (typeof e[0] == "number" && typeof e[1] == "number") {
          this.x = e[0], this.y = e[1];
          return;
        }
      }
      if (t.length === 1 && t[0] instanceof Object && t[0].name === "vector") {
        let { x: e, y: n } = t[0];
        this.x = e, this.y = n;
        return;
      }
      if (t.length === 2) {
        let e = t[0], n = t[1];
        if (typeof e == "number" && typeof n == "number") {
          this.x = e, this.y = n;
          return;
        }
        if (e instanceof o.Point && n instanceof o.Point) {
          this.x = n.x - e.x, this.y = n.y - e.y;
          return;
        }
      }
      throw o.Errors.ILLEGAL_PARAMETERS;
    }
  }
  clone() {
    return new o.Vector(this.x, this.y);
  }
  get slope() {
    let t = Math.atan2(this.y, this.x);
    return t < 0 && (t = 2 * Math.PI + t), t;
  }
  get length() {
    return Math.sqrt(this.dot(this));
  }
  equalTo(t) {
    return o.Utils.EQ(this.x, t.x) && o.Utils.EQ(this.y, t.y);
  }
  multiply(t) {
    return new o.Vector(t * this.x, t * this.y);
  }
  dot(t) {
    return this.x * t.x + this.y * t.y;
  }
  cross(t) {
    return this.x * t.y - this.y * t.x;
  }
  normalize() {
    if (!o.Utils.EQ_0(this.length))
      return new o.Vector(this.x / this.length, this.y / this.length);
    throw o.Errors.ZERO_DIVISION;
  }
  rotate(t) {
    let n = new o.Point(this.x, this.y).rotate(t);
    return new o.Vector(n.x, n.y);
  }
  rotate90CCW() {
    return new o.Vector(-this.y, this.x);
  }
  rotate90CW() {
    return new o.Vector(this.y, -this.x);
  }
  invert() {
    return new o.Vector(-this.x, -this.y);
  }
  add(t) {
    return new o.Vector(this.x + t.x, this.y + t.y);
  }
  subtract(t) {
    return new o.Vector(this.x - t.x, this.y - t.y);
  }
  angleTo(t) {
    let e = this.normalize(), n = t.normalize(), i = Math.atan2(e.cross(n), e.dot(n));
    return i < 0 && (i += 2 * Math.PI), i;
  }
  projectionOn(t) {
    let e = t.normalize(), n = this.dot(e);
    return e.multiply(n);
  }
  toJSON() {
    return Object.assign({}, this, { name: "vector" });
  }
}
o.Vector = Oc;
const Ic = (...r) => new o.Vector(...r);
o.vector = Ic;
class ar {
  constructor(...t) {
    if (this.ps = new o.Point(), this.pe = new o.Point(), t.length !== 0) {
      if (t.length === 1 && t[0] instanceof Array && t[0].length === 4) {
        let e = t[0];
        this.ps = new o.Point(e[0], e[1]), this.pe = new o.Point(e[2], e[3]);
        return;
      }
      if (t.length === 1 && t[0] instanceof Object && t[0].name === "segment") {
        let { ps: e, pe: n } = t[0];
        this.ps = new o.Point(e.x, e.y), this.pe = new o.Point(n.x, n.y);
        return;
      }
      if (t.length === 1 && t[0] instanceof o.Point) {
        this.ps = t[0].clone();
        return;
      }
      if (t.length === 2 && t[0] instanceof o.Point && t[1] instanceof o.Point) {
        this.ps = t[0].clone(), this.pe = t[1].clone();
        return;
      }
      if (t.length === 4) {
        this.ps = new o.Point(t[0], t[1]), this.pe = new o.Point(t[2], t[3]);
        return;
      }
      throw o.Errors.ILLEGAL_PARAMETERS;
    }
  }
  clone() {
    return new o.Segment(this.start, this.end);
  }
  get start() {
    return this.ps;
  }
  get end() {
    return this.pe;
  }
  get vertices() {
    return [this.ps.clone(), this.pe.clone()];
  }
  get length() {
    return this.start.distanceTo(this.end)[0];
  }
  get slope() {
    return new o.Vector(this.start, this.end).slope;
  }
  get box() {
    return new o.Box(
      Math.min(this.start.x, this.end.x),
      Math.min(this.start.y, this.end.y),
      Math.max(this.start.x, this.end.x),
      Math.max(this.start.y, this.end.y)
    );
  }
  equalTo(t) {
    return this.ps.equalTo(t.ps) && this.pe.equalTo(t.pe);
  }
  contains(t) {
    return o.Utils.EQ_0(this.distanceToPoint(t));
  }
  intersect(t) {
    if (t instanceof o.Point)
      return this.contains(t) ? [t] : [];
    if (t instanceof o.Line)
      return un(this, t);
    if (t instanceof o.Segment)
      return _r(this, t);
    if (t instanceof o.Circle)
      return fn(this, t);
    if (t instanceof o.Box)
      return rc(this, t);
    if (t instanceof o.Arc)
      return pe(this, t);
    if (t instanceof o.Polygon)
      return fo(this, t);
  }
  distanceTo(t) {
    if (t instanceof o.Point) {
      let [e, n] = o.Distance.point2segment(t, this);
      return n = n.reverse(), [e, n];
    }
    if (t instanceof o.Circle) {
      let [e, n] = o.Distance.segment2circle(this, t);
      return [e, n];
    }
    if (t instanceof o.Line) {
      let [e, n] = o.Distance.segment2line(this, t);
      return [e, n];
    }
    if (t instanceof o.Segment) {
      let [e, n] = o.Distance.segment2segment(this, t);
      return [e, n];
    }
    if (t instanceof o.Arc) {
      let [e, n] = o.Distance.segment2arc(this, t);
      return [e, n];
    }
    if (t instanceof o.Polygon) {
      let [e, n] = o.Distance.shape2polygon(this, t);
      return [e, n];
    }
    if (t instanceof o.PlanarSet) {
      let [e, n] = o.Distance.shape2planarSet(this, t);
      return [e, n];
    }
  }
  tangentInStart() {
    return new o.Vector(this.start, this.end).normalize();
  }
  tangentInEnd() {
    return new o.Vector(this.end, this.start).normalize();
  }
  reverse() {
    return new ar(this.end, this.start);
  }
  split(t) {
    return this.start.equalTo(t) ? [null, this.clone()] : this.end.equalTo(t) ? [this.clone(), null] : [
      new o.Segment(this.start, t),
      new o.Segment(t, this.end)
    ];
  }
  middle() {
    return new o.Point((this.start.x + this.end.x) / 2, (this.start.y + this.end.y) / 2);
  }
  pointAtLength(t) {
    if (t > this.length || t < 0)
      return null;
    if (t == 0)
      return this.start;
    if (t == this.length)
      return this.end;
    let e = t / this.length;
    return new o.Point(
      (this.end.x - this.start.x) * e + this.start.x,
      (this.end.y - this.start.y) * e + this.start.y
    );
  }
  distanceToPoint(t) {
    let [e, ...n] = o.Distance.point2segment(t, this);
    return e;
  }
  definiteIntegral(t = 0) {
    let e = this.end.x - this.start.x, n = this.start.y - t, i = this.end.y - t;
    return e * (n + i) / 2;
  }
  translate(...t) {
    return new ar(this.ps.translate(...t), this.pe.translate(...t));
  }
  rotate(t = 0, e = new o.Point()) {
    let n = new o.Matrix();
    return n = n.translate(e.x, e.y).rotate(t).translate(-e.x, -e.y), this.transform(n);
  }
  transform(t = new o.Matrix()) {
    return new ar(this.ps.transform(t), this.pe.transform(t));
  }
  isZeroLength() {
    return this.ps.equalTo(this.pe);
  }
  sortPoints(t) {
    return new o.Line(this.start, this.end).sortPoints(t);
  }
  toJSON() {
    return Object.assign({}, this, { name: "segment" });
  }
  svg(t = {}) {
    let { stroke: e, strokeWidth: n, id: i, className: s } = t, a = i && i.length > 0 ? `id="${i}"` : "", l = s && s.length > 0 ? `class="${s}"` : "";
    return `
<line x1="${this.start.x}" y1="${this.start.y}" x2="${this.end.x}" y2="${this.end.y}" stroke="${e || "black"}" stroke-width="${n || 1}" ${a} ${l} />`;
  }
}
o.Segment = ar;
const Pc = (...r) => new o.Segment(...r);
o.segment = Pc;
let { vector: Lr } = o;
class po {
  constructor(...t) {
    if (this.pt = new o.Point(), this.norm = new o.Vector(0, 1), t.length != 0) {
      if (t.length == 1 && t[0] instanceof Object && t[0].name === "line") {
        let { pt: e, norm: n } = t[0];
        this.pt = new o.Point(e), this.norm = new o.Vector(n);
        return;
      }
      if (t.length == 2) {
        let e = t[0], n = t[1];
        if (e instanceof o.Point && n instanceof o.Point) {
          this.pt = e, this.norm = po.points2norm(e, n), this.norm.dot(Lr(this.pt.x, this.pt.y)) >= 0 && this.norm.invert();
          return;
        }
        if (e instanceof o.Point && n instanceof o.Vector) {
          if (o.Utils.EQ_0(n.x) && o.Utils.EQ_0(n.y))
            throw o.Errors.ILLEGAL_PARAMETERS;
          this.pt = e.clone(), this.norm = n.clone(), this.norm = this.norm.normalize(), this.norm.dot(Lr(this.pt.x, this.pt.y)) >= 0 && this.norm.invert();
          return;
        }
        if (e instanceof o.Vector && n instanceof o.Point) {
          if (o.Utils.EQ_0(e.x) && o.Utils.EQ_0(e.y))
            throw o.Errors.ILLEGAL_PARAMETERS;
          this.pt = n.clone(), this.norm = e.clone(), this.norm = this.norm.normalize(), this.norm.dot(Lr(this.pt.x, this.pt.y)) >= 0 && this.norm.invert();
          return;
        }
      }
      throw o.Errors.ILLEGAL_PARAMETERS;
    }
  }
  clone() {
    return new o.Line(this.pt, this.norm);
  }
  get start() {
  }
  get end() {
  }
  get length() {
    return Number.POSITIVE_INFINITY;
  }
  get box() {
    return new o.Box(
      Number.NEGATIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY
    );
  }
  get middle() {
  }
  get slope() {
    return new o.Vector(this.norm.y, -this.norm.x).slope;
  }
  get standard() {
    let t = this.norm.x, e = this.norm.y, n = this.norm.dot(this.pt);
    return [t, e, n];
  }
  parallelTo(t) {
    return o.Utils.EQ_0(this.norm.cross(t.norm));
  }
  incidentTo(t) {
    return this.parallelTo(t) && this.pt.on(t);
  }
  contains(t) {
    if (this.pt.equalTo(t))
      return !0;
    let e = new o.Vector(this.pt, t);
    return o.Utils.EQ_0(this.norm.dot(e));
  }
  coord(t) {
    return Lr(t.x, t.y).cross(this.norm);
  }
  intersect(t) {
    if (t instanceof o.Point)
      return this.contains(t) ? [t] : [];
    if (t instanceof o.Line)
      return ln(this, t);
    if (t instanceof o.Circle)
      return Be(this, t);
    if (t instanceof o.Box)
      return hr(this, t);
    if (t instanceof o.Segment)
      return un(t, this);
    if (t instanceof o.Arc)
      return ao(this, t);
    if (t instanceof o.Polygon)
      return cn(this, t);
  }
  distanceTo(t) {
    if (t instanceof o.Point) {
      let [e, n] = o.Distance.point2line(t, this);
      return n = n.reverse(), [e, n];
    }
    if (t instanceof o.Circle) {
      let [e, n] = o.Distance.circle2line(t, this);
      return n = n.reverse(), [e, n];
    }
    if (t instanceof o.Segment) {
      let [e, n] = o.Distance.segment2line(t, this);
      return [e, n.reverse()];
    }
    if (t instanceof o.Arc) {
      let [e, n] = o.Distance.arc2line(t, this);
      return [e, n.reverse()];
    }
    if (t instanceof o.Polygon) {
      let [e, n] = o.Distance.shape2polygon(this, t);
      return [e, n];
    }
  }
  split(t) {
    if (t instanceof o.Point)
      return [new o.Ray(t, this.norm.invert()), new o.Ray(t, this.norm)];
    {
      let e = new o.Multiline([this]), n = this.sortPoints(t);
      return e.split(n), e.toShapes();
    }
  }
  sortPoints(t) {
    return t.slice().sort((e, n) => this.coord(e) < this.coord(n) ? -1 : this.coord(e) > this.coord(n) ? 1 : 0);
  }
  toJSON() {
    return Object.assign({}, this, { name: "line" });
  }
  svg(t, e = {}) {
    let n = hr(this, t);
    if (n.length === 0)
      return "";
    let i = n[0], s = n.length == 2 ? n[1] : n.find((l) => !l.equalTo(i));
    return s === void 0 && (s = i), new o.Segment(i, s).svg(e);
  }
  static points2norm(t, e) {
    if (t.equalTo(e))
      throw o.Errors.ILLEGAL_PARAMETERS;
    return new o.Vector(t, e).normalize().rotate90CCW();
  }
}
o.Line = po;
const Tc = (...r) => new o.Line(...r);
o.line = Tc;
class Ac {
  constructor(...t) {
    if (this.pc = new o.Point(), this.r = 1, t.length == 1 && t[0] instanceof Object && t[0].name === "circle") {
      let { pc: e, r: n } = t[0];
      this.pc = new o.Point(e), this.r = n;
      return;
    } else {
      let [e, n] = [...t];
      e && e instanceof o.Point && (this.pc = e.clone()), n !== void 0 && (this.r = n);
      return;
    }
  }
  clone() {
    return new o.Circle(this.pc.clone(), this.r);
  }
  get center() {
    return this.pc;
  }
  get box() {
    return new o.Box(
      this.pc.x - this.r,
      this.pc.y - this.r,
      this.pc.x + this.r,
      this.pc.y + this.r
    );
  }
  contains(t) {
    if (t instanceof o.Point)
      return o.Utils.LE(t.distanceTo(this.center)[0], this.r);
    if (t instanceof o.Segment)
      return o.Utils.LE(t.start.distanceTo(this.center)[0], this.r) && o.Utils.LE(t.end.distanceTo(this.center)[0], this.r);
    if (t instanceof o.Arc)
      return this.intersect(t).length === 0 && o.Utils.LE(t.start.distanceTo(this.center)[0], this.r) && o.Utils.LE(t.end.distanceTo(this.center)[0], this.r);
    if (t instanceof o.Circle)
      return this.intersect(t).length === 0 && o.Utils.LE(t.r, this.r) && o.Utils.LE(t.center.distanceTo(this.center)[0], this.r);
  }
  toArc(t = !0) {
    return new o.Arc(this.center, this.r, Math.PI, -Math.PI, t);
  }
  intersect(t) {
    if (t instanceof o.Point)
      return this.contains(t) ? [t] : [];
    if (t instanceof o.Line)
      return Be(t, this);
    if (t instanceof o.Segment)
      return fn(t, this);
    if (t instanceof o.Circle)
      return vl(t, this);
    if (t instanceof o.Box)
      return nc(this, t);
    if (t instanceof o.Arc)
      return uo(t, this);
    if (t instanceof o.Polygon)
      return yl(this, t);
  }
  distanceTo(t) {
    if (t instanceof o.Point) {
      let [e, n] = o.Distance.point2circle(t, this);
      return n = n.reverse(), [e, n];
    }
    if (t instanceof o.Circle) {
      let [e, n] = o.Distance.circle2circle(this, t);
      return [e, n];
    }
    if (t instanceof o.Line) {
      let [e, n] = o.Distance.circle2line(this, t);
      return [e, n];
    }
    if (t instanceof o.Segment) {
      let [e, n] = o.Distance.segment2circle(t, this);
      return n = n.reverse(), [e, n];
    }
    if (t instanceof o.Arc) {
      let [e, n] = o.Distance.arc2circle(t, this);
      return n = n.reverse(), [e, n];
    }
    if (t instanceof o.Polygon) {
      let [e, n] = o.Distance.shape2polygon(this, t);
      return [e, n];
    }
    if (t instanceof o.PlanarSet) {
      let [e, n] = o.Distance.shape2planarSet(this, t);
      return [e, n];
    }
  }
  toJSON() {
    return Object.assign({}, this, { name: "circle" });
  }
  svg(t = {}) {
    let { stroke: e, strokeWidth: n, fill: i, fillOpacity: s, id: a, className: l } = t, f = a && a.length > 0 ? `id="${a}"` : "", u = l && l.length > 0 ? `class="${l}"` : "";
    return `
<circle cx="${this.pc.x}" cy="${this.pc.y}" r="${this.r}" stroke="${e || "black"}" stroke-width="${n || 1}" fill="${i || "none"}" fill-opacity="${s || 1}" ${f} ${u} />`;
  }
}
o.Circle = Ac;
const Rc = (...r) => new o.Circle(...r);
o.circle = Rc;
class Lc {
  constructor(...t) {
    if (this.pc = new o.Point(), this.r = 1, this.startAngle = 0, this.endAngle = 2 * Math.PI, this.counterClockwise = o.CCW, t.length != 0)
      if (t.length == 1 && t[0] instanceof Object && t[0].name === "arc") {
        let { pc: e, r: n, startAngle: i, endAngle: s, counterClockwise: a } = t[0];
        this.pc = new o.Point(e.x, e.y), this.r = n, this.startAngle = i, this.endAngle = s, this.counterClockwise = a;
        return;
      } else {
        let [e, n, i, s, a] = [...t];
        e && e instanceof o.Point && (this.pc = e.clone()), n !== void 0 && (this.r = n), i !== void 0 && (this.startAngle = i), s !== void 0 && (this.endAngle = s), a !== void 0 && (this.counterClockwise = a);
        return;
      }
  }
  clone() {
    return new o.Arc(this.pc.clone(), this.r, this.startAngle, this.endAngle, this.counterClockwise);
  }
  get sweep() {
    if (o.Utils.EQ(this.startAngle, this.endAngle))
      return 0;
    if (o.Utils.EQ(Math.abs(this.startAngle - this.endAngle), o.PIx2))
      return o.PIx2;
    let t;
    return this.counterClockwise ? t = o.Utils.GT(this.endAngle, this.startAngle) ? this.endAngle - this.startAngle : this.endAngle - this.startAngle + o.PIx2 : t = o.Utils.GT(this.startAngle, this.endAngle) ? this.startAngle - this.endAngle : this.startAngle - this.endAngle + o.PIx2, o.Utils.GT(t, o.PIx2) && (t -= o.PIx2), o.Utils.LT(t, 0) && (t += o.PIx2), t;
  }
  get start() {
    return new o.Point(this.pc.x + this.r, this.pc.y).rotate(this.startAngle, this.pc);
  }
  get end() {
    return new o.Point(this.pc.x + this.r, this.pc.y).rotate(this.endAngle, this.pc);
  }
  get center() {
    return this.pc.clone();
  }
  get vertices() {
    return [this.start.clone(), this.end.clone()];
  }
  get length() {
    return Math.abs(this.sweep * this.r);
  }
  get box() {
    let e = this.breakToFunctional().reduce((n, i) => n.merge(i.start.box), new o.Box());
    return e = e.merge(this.end.box), e;
  }
  contains(t) {
    if (!o.Utils.EQ(this.pc.distanceTo(t)[0], this.r))
      return !1;
    if (t.equalTo(this.start))
      return !0;
    let e = new o.Vector(this.pc, t).slope, n = new o.Arc(this.pc, this.r, this.startAngle, e, this.counterClockwise);
    return o.Utils.LE(n.length, this.length);
  }
  split(t) {
    if (this.start.equalTo(t))
      return [null, this.clone()];
    if (this.end.equalTo(t))
      return [this.clone(), null];
    let e = new o.Vector(this.pc, t).slope;
    return [
      new o.Arc(this.pc, this.r, this.startAngle, e, this.counterClockwise),
      new o.Arc(this.pc, this.r, e, this.endAngle, this.counterClockwise)
    ];
  }
  middle() {
    let t = this.counterClockwise ? this.startAngle + this.sweep / 2 : this.startAngle - this.sweep / 2;
    return new o.Arc(this.pc, this.r, this.startAngle, t, this.counterClockwise).end;
  }
  pointAtLength(t) {
    if (t > this.length || t < 0)
      return null;
    if (t == 0)
      return this.start;
    if (t == this.length)
      return this.end;
    let e = t / this.length, n = this.counterClockwise ? this.startAngle + this.sweep * e : this.startAngle - this.sweep * e;
    return new o.Arc(this.pc, this.r, this.startAngle, n, this.counterClockwise).end;
  }
  chordHeight() {
    return (1 - Math.cos(Math.abs(this.sweep / 2))) * this.r;
  }
  intersect(t) {
    if (t instanceof o.Point)
      return this.contains(t) ? [t] : [];
    if (t instanceof o.Line)
      return ao(t, this);
    if (t instanceof o.Circle)
      return uo(this, t);
    if (t instanceof o.Segment)
      return pe(t, this);
    if (t instanceof o.Box)
      return ic(this, t);
    if (t instanceof o.Arc)
      return lo(this, t);
    if (t instanceof o.Polygon)
      return co(this, t);
  }
  distanceTo(t) {
    if (t instanceof o.Point) {
      let [e, n] = o.Distance.point2arc(t, this);
      return n = n.reverse(), [e, n];
    }
    if (t instanceof o.Circle) {
      let [e, n] = o.Distance.arc2circle(this, t);
      return [e, n];
    }
    if (t instanceof o.Line) {
      let [e, n] = o.Distance.arc2line(this, t);
      return [e, n];
    }
    if (t instanceof o.Segment) {
      let [e, n] = o.Distance.segment2arc(t, this);
      return n = n.reverse(), [e, n];
    }
    if (t instanceof o.Arc) {
      let [e, n] = o.Distance.arc2arc(this, t);
      return [e, n];
    }
    if (t instanceof o.Polygon) {
      let [e, n] = o.Distance.shape2polygon(this, t);
      return [e, n];
    }
    if (t instanceof o.PlanarSet) {
      let [e, n] = o.Distance.shape2planarSet(this, t);
      return [e, n];
    }
  }
  breakToFunctional() {
    let t = [], e = [0, Math.PI / 2, 2 * Math.PI / 2, 3 * Math.PI / 2], n = [
      this.pc.translate(this.r, 0),
      this.pc.translate(0, this.r),
      this.pc.translate(-this.r, 0),
      this.pc.translate(0, -this.r)
    ], i = [];
    for (let s = 0; s < 4; s++)
      n[s].on(this) && i.push(new o.Arc(this.pc, this.r, this.startAngle, e[s], this.counterClockwise));
    if (i.length == 0)
      t.push(this.clone());
    else {
      i.sort((l, f) => l.length - f.length);
      for (let l = 0; l < i.length; l++) {
        let f = t.length > 0 ? t[t.length - 1] : void 0, u;
        f ? u = new o.Arc(this.pc, this.r, f.endAngle, i[l].endAngle, this.counterClockwise) : u = new o.Arc(this.pc, this.r, this.startAngle, i[l].endAngle, this.counterClockwise), o.Utils.EQ_0(u.length) || t.push(u.clone());
      }
      let s = t.length > 0 ? t[t.length - 1] : void 0, a;
      s ? a = new o.Arc(this.pc, this.r, s.endAngle, this.endAngle, this.counterClockwise) : a = new o.Arc(this.pc, this.r, this.startAngle, this.endAngle, this.counterClockwise), !o.Utils.EQ_0(a.length) && !o.Utils.EQ(a.sweep, 2 * Math.PI) && t.push(a.clone());
    }
    return t;
  }
  tangentInStart() {
    let t = new o.Vector(this.pc, this.start), e = this.counterClockwise ? Math.PI / 2 : -Math.PI / 2;
    return t.rotate(e).normalize();
  }
  tangentInEnd() {
    let t = new o.Vector(this.pc, this.end), e = this.counterClockwise ? -Math.PI / 2 : Math.PI / 2;
    return t.rotate(e).normalize();
  }
  reverse() {
    return new o.Arc(this.pc, this.r, this.endAngle, this.startAngle, !this.counterClockwise);
  }
  translate(...t) {
    let e = this.clone();
    return e.pc = this.pc.translate(...t), e;
  }
  rotate(t = 0, e = new o.Point()) {
    let n = new o.Matrix();
    return n = n.translate(e.x, e.y).rotate(t).translate(-e.x, -e.y), this.transform(n);
  }
  scale(t = 1, e = 1) {
    let n = new o.Matrix();
    return n = n.scale(t, e), this.transform(n);
  }
  transform(t = new o.Matrix()) {
    let e = this.start.transform(t), n = this.end.transform(t), i = this.pc.transform(t), s = this.counterClockwise;
    return t.a * t.d < 0 && (s = !s), o.Arc.arcSE(i, e, n, s);
  }
  static arcSE(t, e, n, i) {
    let { vector: s } = o, a = s(t, e).slope, l = s(t, n).slope;
    o.Utils.EQ(a, l) && (l += 2 * Math.PI, i = !0);
    let f = s(t, e).length;
    return new o.Arc(t, f, a, l, i);
  }
  definiteIntegral(t = 0) {
    return this.breakToFunctional().reduce((i, s) => i + s.circularSegmentDefiniteIntegral(t), 0);
  }
  circularSegmentDefiniteIntegral(t) {
    let e = new o.Line(this.start, this.end), n = this.pc.leftTo(e), s = new o.Segment(this.start, this.end).definiteIntegral(t), a = this.circularSegmentArea();
    return n ? s - a : s + a;
  }
  circularSegmentArea() {
    return 0.5 * this.r * this.r * (this.sweep - Math.sin(this.sweep));
  }
  sortPoints(t) {
    let { vector: e } = o;
    return t.slice().sort((n, i) => {
      let s = e(this.pc, n).slope, a = e(this.pc, i).slope;
      return s < a ? -1 : s > a ? 1 : 0;
    });
  }
  toJSON() {
    return Object.assign({}, this, { name: "arc" });
  }
  svg(t = {}) {
    let e = this.sweep <= Math.PI ? "0" : "1", n = this.counterClockwise ? "1" : "0", { stroke: i, strokeWidth: s, fill: a, id: l, className: f } = t, u = l && l.length > 0 ? `id="${l}"` : "", c = f && f.length > 0 ? `class="${f}"` : "";
    return o.Utils.EQ(this.sweep, 2 * Math.PI) ? new o.Circle(this.pc, this.r).svg(t) : `
<path d="M${this.start.x},${this.start.y}
                             A${this.r},${this.r} 0 ${e},${n} ${this.end.x},${this.end.y}"
                    stroke="${i || "black"}" stroke-width="${s || 1}" fill="${a || "none"}" ${u} ${c} />`;
  }
}
o.Arc = Lc;
const Cc = (...r) => new o.Arc(...r);
o.arc = Cc;
class Jr {
  constructor(t = void 0, e = void 0, n = void 0, i = void 0) {
    this.xmin = t, this.ymin = e, this.xmax = n, this.ymax = i;
  }
  clone() {
    return new Jr(this.xmin, this.ymin, this.xmax, this.ymax);
  }
  get low() {
    return new o.Point(this.xmin, this.ymin);
  }
  get high() {
    return new o.Point(this.xmax, this.ymax);
  }
  get max() {
    return this.clone();
  }
  get center() {
    return new o.Point((this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2);
  }
  get width() {
    return Math.abs(this.xmax - this.xmin);
  }
  get height() {
    return Math.abs(this.ymax - this.ymin);
  }
  get box() {
    return this.clone();
  }
  not_intersect(t) {
    return this.xmax < t.xmin || this.xmin > t.xmax || this.ymax < t.ymin || this.ymin > t.ymax;
  }
  intersect(t) {
    return !this.not_intersect(t);
  }
  merge(t) {
    return new Jr(
      this.xmin === void 0 ? t.xmin : Math.min(this.xmin, t.xmin),
      this.ymin === void 0 ? t.ymin : Math.min(this.ymin, t.ymin),
      this.xmax === void 0 ? t.xmax : Math.max(this.xmax, t.xmax),
      this.ymax === void 0 ? t.ymax : Math.max(this.ymax, t.ymax)
    );
  }
  less_than(t) {
    return !!(this.low.lessThan(t.low) || this.low.equalTo(t.low) && this.high.lessThan(t.high));
  }
  equal_to(t) {
    return this.low.equalTo(t.low) && this.high.equalTo(t.high);
  }
  output() {
    return this.clone();
  }
  static comparable_max(t, e) {
    return t.merge(e);
  }
  static comparable_less_than(t, e) {
    return t.lessThan(e);
  }
  set(t, e, n, i) {
    this.xmin = t, this.ymin = e, this.xmax = n, this.ymax = i;
  }
  toPoints() {
    return [
      new o.Point(this.xmin, this.ymin),
      new o.Point(this.xmax, this.ymin),
      new o.Point(this.xmax, this.ymax),
      new o.Point(this.xmin, this.ymax)
    ];
  }
  toSegments() {
    let t = this.toPoints();
    return [
      new o.Segment(t[0], t[1]),
      new o.Segment(t[1], t[2]),
      new o.Segment(t[2], t[3]),
      new o.Segment(t[3], t[0])
    ];
  }
  svg(t = {}) {
    let { stroke: e, strokeWidth: n, fill: i, id: s, className: a } = t, l = s && s.length > 0 ? `id="${s}"` : "", f = a && a.length > 0 ? `class="${a}"` : "", u = this.xmax - this.xmin, c = this.ymax - this.ymin;
    return `
<rect x="${this.xmin}" y="${this.ymin}" width=${u} height=${c} stroke="${e || "black"}" stroke-width="${n || 1}" fill="${i || "none"}" ${l} ${f} />`;
  }
}
o.Box = Jr;
const Nc = (...r) => new o.Box(...r);
o.box = Nc;
class Mc {
  constructor(t) {
    this.shape = t, this.next = void 0, this.prev = void 0, this.face = void 0, this.arc_length = 0, this.bvStart = void 0, this.bvEnd = void 0, this.bv = void 0, this.overlap = void 0;
  }
  get start() {
    return this.shape.start;
  }
  get end() {
    return this.shape.end;
  }
  get length() {
    return this.shape.length;
  }
  get box() {
    return this.shape.box;
  }
  isSegment() {
    return this.shape instanceof o.Segment;
  }
  isArc() {
    return this.shape instanceof o.Arc;
  }
  middle() {
    return this.shape.middle();
  }
  pointAtLength(t) {
    return this.shape.pointAtLength(t);
  }
  contains(t) {
    return this.shape.contains(t);
  }
  setInclusion(t) {
    if (this.bv !== void 0)
      return this.bv;
    if (this.shape instanceof o.Line || this.shape instanceof o.Ray)
      return this.bv = o.OUTSIDE, this.bv;
    if (this.bvStart === void 0 && (this.bvStart = sr(t, this.start)), this.bvEnd === void 0 && (this.bvEnd = sr(t, this.end)), this.bvStart === o.OUTSIDE || this.bvEnd == o.OUTSIDE)
      this.bv = o.OUTSIDE;
    else if (this.bvStart === o.INSIDE || this.bvEnd == o.INSIDE)
      this.bv = o.INSIDE;
    else {
      let e = sr(t, this.middle());
      this.bv = e;
    }
    return this.bv;
  }
  setOverlap(t) {
    let e, n = this.shape, i = t.shape;
    n instanceof o.Segment && i instanceof o.Segment ? n.start.equalTo(i.start) && n.end.equalTo(i.end) ? e = o.OVERLAP_SAME : n.start.equalTo(i.end) && n.end.equalTo(i.start) && (e = o.OVERLAP_OPPOSITE) : (n instanceof o.Arc && i instanceof o.Arc || n instanceof o.Segment && i instanceof o.Arc || n instanceof o.Arc && i instanceof o.Segment) && (n.start.equalTo(i.start) && n.end.equalTo(i.end) && n.middle().equalTo(i.middle()) ? e = o.OVERLAP_SAME : n.start.equalTo(i.end) && n.end.equalTo(i.start) && n.middle().equalTo(i.middle()) && (e = o.OVERLAP_OPPOSITE)), this.overlap === void 0 && (this.overlap = e), t.overlap === void 0 && (t.overlap = e);
  }
  svg() {
    if (this.shape instanceof o.Segment)
      return ` L${this.shape.end.x},${this.shape.end.y}`;
    if (this.shape instanceof o.Arc) {
      let t = this.shape, e, n = t.counterClockwise ? "1" : "0";
      if (o.Utils.EQ(t.sweep, 2 * Math.PI)) {
        let i = t.counterClockwise ? 1 : -1, s = new o.Arc(t.pc, t.r, t.startAngle, t.startAngle + i * Math.PI, t.counterClockwise), a = new o.Arc(t.pc, t.r, t.startAngle + i * Math.PI, t.endAngle, t.counterClockwise);
        return e = "0", ` A${s.r},${s.r} 0 ${e},${n} ${s.end.x},${s.end.y}
                    A${a.r},${a.r} 0 ${e},${n} ${a.end.x},${a.end.y}`;
      } else
        return e = t.sweep <= Math.PI ? "0" : "1", ` A${t.r},${t.r} 0 ${e},${n} ${t.end.x},${t.end.y}`;
    }
  }
  toJSON() {
    return this.shape.toJSON();
  }
}
o.Edge = Mc;
class kc extends oo {
  constructor(t, e) {
    super(t, e), this.setCircularLinks();
  }
  setCircularLinks() {
    this.isEmpty() || (this.last.next = this.first, this.first.prev = this.last);
  }
  [Symbol.iterator]() {
    let t;
    return {
      next: () => {
        let e = t || this.first, n = this.first ? t ? t === this.first : !1 : !0;
        return t = e ? e.next : void 0, { value: e, done: n };
      }
    };
  }
  append(t) {
    return super.append(t), this.setCircularLinks(), this;
  }
  insert(t, e) {
    return super.insert(t, e), this.setCircularLinks(), this;
  }
  remove(t) {
    return super.remove(t), this;
  }
}
class Oe extends kc {
  constructor(t, ...e) {
    if (super(), this._box = void 0, this._orientation = void 0, e.length != 0) {
      if (e.length == 1) {
        if (e[0] instanceof Array) {
          let n = e[0];
          if (n.length == 0)
            return;
          if (n.every((i) => i instanceof o.Point)) {
            let i = Oe.points2segments(n);
            this.shapes2face(t.edges, i);
          } else if (n.every((i) => i instanceof Array && i.length === 2)) {
            let i = n.map((a) => new o.Point(a[0], a[1])), s = Oe.points2segments(i);
            this.shapes2face(t.edges, s);
          } else if (n.every((i) => i instanceof o.Segment || i instanceof o.Arc))
            this.shapes2face(t.edges, n);
          else if (n.every((i) => i.name === "segment" || i.name === "arc")) {
            let i = [];
            for (let s of n) {
              let a;
              s.name === "segment" ? a = new o.Segment(s) : a = new o.Arc(s), i.push(a);
            }
            this.shapes2face(t.edges, i);
          }
        } else if (e[0] instanceof Oe) {
          let n = e[0];
          this.first = n.first, this.last = n.last;
          for (let i of n)
            t.edges.add(i);
        } else if (e[0] instanceof o.Circle)
          this.shapes2face(t.edges, [e[0].toArc(o.CCW)]);
        else if (e[0] instanceof o.Box) {
          let n = e[0];
          this.shapes2face(t.edges, [
            new o.Segment(new o.Point(n.xmin, n.ymin), new o.Point(n.xmax, n.ymin)),
            new o.Segment(new o.Point(n.xmax, n.ymin), new o.Point(n.xmax, n.ymax)),
            new o.Segment(new o.Point(n.xmax, n.ymax), new o.Point(n.xmin, n.ymax)),
            new o.Segment(new o.Point(n.xmin, n.ymax), new o.Point(n.xmin, n.ymin))
          ]);
        }
      }
      e.length == 2 && e[0] instanceof o.Edge && e[1] instanceof o.Edge && (this.first = e[0], this.last = e[1], this.last.next = this.first, this.first.prev = this.last, this.setArcLength());
    }
  }
  get edges() {
    return this.toArray();
  }
  get shapes() {
    return this.edges.map((t) => t.shape.clone());
  }
  get box() {
    if (this._box === void 0) {
      let t = new o.Box();
      for (let e of this)
        t = t.merge(e.box);
      this._box = t;
    }
    return this._box;
  }
  get perimeter() {
    return this.last.arc_length + this.last.length;
  }
  pointAtLength(t) {
    if (t > this.perimeter || t < 0)
      return null;
    let e = null;
    for (let n of this)
      if (t >= n.arc_length && (n === this.last || t < n.next.arc_length)) {
        e = n.pointAtLength(t - n.arc_length);
        break;
      }
    return e;
  }
  static points2segments(t) {
    let e = [];
    for (let n = 0; n < t.length; n++)
      t[n].equalTo(t[(n + 1) % t.length]) || e.push(new o.Segment(t[n], t[(n + 1) % t.length]));
    return e;
  }
  shapes2face(t, e) {
    for (let n of e) {
      let i = new o.Edge(n);
      this.append(i), t.add(i);
    }
  }
  append(t) {
    return super.append(t), this.setOneEdgeArcLength(t), t.face = this, this;
  }
  insert(t, e) {
    return super.insert(t, e), this.setOneEdgeArcLength(t), t.face = this, this;
  }
  remove(t) {
    return super.remove(t), this.setArcLength(), this;
  }
  reverse() {
    let t = [], e = this.last;
    do
      e.shape = e.shape.reverse(), t.push(e), e = e.prev;
    while (e !== this.last);
    this.first = void 0, this.last = void 0;
    for (let n of t)
      this.first === void 0 ? (n.prev = n, n.next = n, this.first = n, this.last = n) : (n.prev = this.last, this.last.next = n, this.last = n, this.last.next = this.first, this.first.prev = this.last), this.setOneEdgeArcLength(n);
    this._orientation !== void 0 && (this._orientation = void 0, this._orientation = this.orientation());
  }
  setArcLength() {
    for (let t of this)
      this.setOneEdgeArcLength(t), t.face = this;
  }
  setOneEdgeArcLength(t) {
    t === this.first ? t.arc_length = 0 : t.arc_length = t.prev.arc_length + t.prev.length;
  }
  area() {
    return Math.abs(this.signedArea());
  }
  signedArea() {
    let t = 0, e = this.box.ymin;
    for (let n of this)
      t += n.shape.definiteIntegral(e);
    return t;
  }
  orientation() {
    if (this._orientation === void 0) {
      let t = this.signedArea();
      o.Utils.EQ_0(t) ? this._orientation = o.ORIENTATION.NOT_ORIENTABLE : o.Utils.LT(t, 0) ? this._orientation = o.ORIENTATION.CCW : this._orientation = o.ORIENTATION.CW;
    }
    return this._orientation;
  }
  isSimple(t) {
    return Oe.getSelfIntersections(this, t, !0).length == 0;
  }
  static getSelfIntersections(t, e, n = !1) {
    let i = [];
    for (let s of t) {
      let a = e.search(s.box);
      for (let l of a) {
        if (s === l || l.face !== t || s.shape instanceof o.Segment && l.shape instanceof o.Segment && (s.next === l || s.prev === l))
          continue;
        let f = s.shape.intersect(l.shape);
        for (let u of f)
          if (!(u.equalTo(s.start) && u.equalTo(l.end) && l === s.prev) && !(u.equalTo(s.end) && u.equalTo(l.start) && l === s.next) && (i.push(u), n))
            break;
        if (i.length > 0 && n)
          break;
      }
      if (i.length > 0 && n)
        break;
    }
    return i;
  }
  findEdgeByPoint(t) {
    let e;
    for (let n of this)
      if (n.shape.contains(t)) {
        e = n;
        break;
      }
    return e;
  }
  toPolygon() {
    return new o.Polygon(this.shapes);
  }
  toJSON() {
    return this.edges.map((t) => t.toJSON());
  }
  svg() {
    let t = `
M${this.first.start.x},${this.first.start.y}`;
    for (let e of this)
      t += e.svg();
    return t += " z", t;
  }
}
o.Face = Oe;
class vo {
  constructor(...t) {
    if (this.pt = new o.Point(), this.norm = new o.Vector(0, 1), t.length != 0 && (t.length >= 1 && t[0] instanceof o.Point && (this.pt = t[0].clone()), t.length !== 1)) {
      if (t.length === 2 && t[1] instanceof o.Vector) {
        this.norm = t[1].clone();
        return;
      }
      throw o.Errors.ILLEGAL_PARAMETERS;
    }
  }
  clone() {
    return new vo(this.pt, this.norm);
  }
  get slope() {
    return new o.Vector(this.norm.y, -this.norm.x).slope;
  }
  get box() {
    let t = this.slope;
    return new o.Box(
      t > Math.PI / 2 && t < 3 * Math.PI / 2 ? Number.NEGATIVE_INFINITY : this.pt.x,
      t >= 0 && t <= Math.PI ? this.pt.y : Number.NEGATIVE_INFINITY,
      t >= Math.PI / 2 && t <= 3 * Math.PI / 2 ? this.pt.x : Number.POSITIVE_INFINITY,
      t >= Math.PI && t <= 2 * Math.PI || t == 0 ? this.pt.y : Number.POSITIVE_INFINITY
    );
  }
  get start() {
    return this.pt;
  }
  get end() {
  }
  get length() {
    return Number.POSITIVE_INFINITY;
  }
  contains(t) {
    if (this.pt.equalTo(t))
      return !0;
    let e = new o.Vector(this.pt, t);
    return o.Utils.EQ_0(this.norm.dot(e)) && o.Utils.GE(e.cross(this.norm), 0);
  }
  split(t) {
    return this.contains(t) ? this.pt.equalTo(t) ? [this] : [
      new o.Segment(this.pt, t),
      new o.Ray(t, this.norm)
    ] : [];
  }
  intersect(t) {
    if (t instanceof o.Segment)
      return this.intersectRay2Segment(this, t);
    if (t instanceof o.Arc)
      return this.intersectRay2Arc(this, t);
  }
  intersectRay2Segment(t, e) {
    let n = [], i = new o.Line(t.start, t.norm), s = i.intersect(e);
    for (let a of s)
      t.contains(a) && n.push(a);
    return s.length == 2 && n.length == 1 && t.start.on(i) && n.push(t.start), n;
  }
  intersectRay2Arc(t, e) {
    let n = [], s = new o.Line(t.start, t.norm).intersect(e);
    for (let a of s)
      t.contains(a) && n.push(a);
    return n;
  }
  svg(t, e = {}) {
    let n = new o.Line(this.pt, this.norm), i = hr(n, t);
    return i = i.filter((a) => this.contains(a)), i.length === 0 || i.length === 2 ? "" : new o.Segment(this.pt, i[0]).svg(e);
  }
}
o.Ray = vo;
const Fc = (...r) => new o.Ray(...r);
o.ray = Fc;
class Ie {
  constructor() {
    this.faces = new o.PlanarSet(), this.edges = new o.PlanarSet();
    let t = [...arguments];
    if (t.length === 1 && (t[0] instanceof Array && t[0].length > 0 || t[0] instanceof o.Circle || t[0] instanceof o.Box)) {
      let e = t[0];
      if (t[0] instanceof Array && t[0].every((n) => n instanceof Array))
        if (e.every((n) => n instanceof Array && n.length === 2 && typeof n[0] == "number" && typeof n[1] == "number"))
          this.faces.add(new o.Face(this, e));
        else
          for (let n of e)
            if (n instanceof Array && n[0] instanceof Array && n[0].every((i) => i instanceof Array && i.length === 2 && typeof i[0] == "number" && typeof i[1] == "number"))
              for (let i of n)
                this.faces.add(new o.Face(this, i));
            else
              this.faces.add(new o.Face(this, n));
      else
        this.faces.add(new o.Face(this, e));
    }
  }
  get box() {
    return [...this.faces].reduce((t, e) => t.merge(e.box), new o.Box());
  }
  get vertices() {
    return [...this.edges].map((t) => t.start);
  }
  clone() {
    let t = new Ie();
    for (let e of this.faces)
      t.addFace(e.shapes);
    return t;
  }
  isEmpty() {
    return this.edges.size === 0;
  }
  isValid() {
    let t = !0;
    for (let e of this.faces)
      if (!e.isSimple(this.edges)) {
        t = !1;
        break;
      }
    return t;
  }
  area() {
    let t = [...this.faces].reduce((e, n) => e + n.signedArea(), 0);
    return Math.abs(t);
  }
  addFace(...t) {
    let e = new o.Face(this, ...t);
    return this.faces.add(e), e;
  }
  deleteFace(t) {
    for (let e of t)
      this.edges.delete(e);
    return this.faces.delete(t);
  }
  recreateFaces() {
    this.faces.clear();
    for (let n of this.edges)
      n.face = null;
    let t, e = !0;
    for (; e; ) {
      e = !1;
      for (let n of this.edges)
        if (n.face === null) {
          t = n, e = !0;
          break;
        }
      if (e) {
        let n = t;
        do
          n = n.next;
        while (n.next !== t);
        this.addFace(t, n);
      }
    }
  }
  removeChain(t, e, n) {
    if (n.next === e) {
      this.deleteFace(t);
      return;
    }
    for (let i = e; i !== n.next; i = i.next)
      if (t.remove(i), this.edges.delete(i), t.isEmpty()) {
        this.deleteFace(t);
        break;
      }
  }
  addVertex(t, e) {
    let n = e.shape.split(t);
    if (n[0] === null)
      return e.prev;
    if (n[1] === null)
      return e;
    let i = new o.Edge(n[0]), s = e.prev;
    return e.face.insert(i, s), this.edges.delete(e), this.edges.add(i), e.shape = n[1], this.edges.add(e), i;
  }
  cut(t) {
    let e = [this.clone()];
    for (let n of t) {
      if (n.setInclusion(this) !== ir)
        continue;
      let i = n.shape.start, s = n.shape.end, a = [];
      for (let l of e)
        if (l.findEdgeByPoint(i) === void 0)
          a.push(l);
        else {
          let [f, u] = l.cutFace(i, s);
          a.push(f, u);
        }
      e = a;
    }
    return e;
  }
  cutFace(t, e) {
    let n = this.findEdgeByPoint(t), i = this.findEdgeByPoint(e);
    if (n.face !== i.face)
      return [];
    let s = this.addVertex(t, n);
    i = this.findEdgeByPoint(e);
    let a = this.addVertex(e, i), l = s.face, f = new o.Edge(
      new o.Segment(s.end, a.end)
    ), u = new o.Edge(
      new o.Segment(a.end, s.end)
    );
    s.next.prev = u, u.next = s.next, s.next = f, f.prev = s, a.next.prev = f, f.next = a.next, a.next = u, u.prev = a, this.edges.add(f), this.edges.add(u);
    let c = this.addFace(f, s), d = this.addFace(u, a);
    return this.faces.delete(l), [c.toPolygon(), d.toPolygon()];
  }
  cutWithLine(t) {
    let e = this.clone(), n = new kt([t]), i = {
      int_points1: [],
      int_points2: [],
      int_points1_sorted: [],
      int_points2_sorted: []
    };
    for (let l of e.edges) {
      let f = gl(l, t);
      for (let u of f)
        Re(n.first, u, i.int_points1), Re(l, u, i.int_points2);
    }
    if (i.int_points1.length === 0)
      return e;
    i.int_points1_sorted = Tn(t, i.int_points1), i.int_points2_sorted = or(i.int_points2), Ce(n, i.int_points1_sorted), Ce(e, i.int_points2_sorted), so(i), i.int_points1_sorted = Tn(t, i.int_points1), i.int_points2_sorted = or(i.int_points2), Si(i.int_points1), Ei(i.int_points1, e);
    for (let l of i.int_points1_sorted)
      l.edge_before.bv === l.edge_after.bv && (i.int_points2[l.id] = -1, l.id = -1);
    if (i.int_points1 = i.int_points1.filter((l) => l.id >= 0), i.int_points2 = i.int_points2.filter((l) => l.id >= 0), i.int_points1.length === 0)
      return e;
    i.int_points1_sorted = Tn(t, i.int_points1), i.int_points2_sorted = or(i.int_points2);
    let s = i.int_points1[0], a;
    for (let l of i.int_points1_sorted)
      l.edge_before.bv === ir && (a = new o.Edge(new o.Segment(s.pt, l.pt)), os(i.int_points2[s.id], i.int_points2[l.id], a), e.edges.add(a), a = new o.Edge(new o.Segment(l.pt, s.pt)), os(i.int_points2[l.id], i.int_points2[s.id], a), e.edges.add(a)), s = l;
    return e.recreateFaces(), e;
  }
  findEdgeByPoint(t) {
    let e;
    for (let n of this.faces)
      if (e = n.findEdgeByPoint(t), e !== void 0)
        break;
    return e;
  }
  splitToIslands() {
    if (this.isEmpty())
      return [];
    let t = this.toArray();
    t.sort((i, s) => s.area() - i.area());
    let e = [...t[0].faces][0].orientation(), n = t.filter((i) => [...i.faces][0].orientation() === e);
    for (let i of t) {
      let s = [...i.faces][0];
      if (s.orientation() !== e) {
        for (let a of n)
          if (s.shapes.every((l) => a.contains(l))) {
            a.addFace(s.shapes);
            break;
          }
      }
    }
    return n;
  }
  reverse() {
    for (let t of this.faces)
      t.reverse();
    return this;
  }
  contains(t) {
    if (t instanceof o.Point) {
      let e = sr(this, t);
      return e === ir || e === Ft;
    } else
      return xl(this, t);
  }
  distanceTo(t) {
    if (t instanceof o.Point) {
      let [e, n] = o.Distance.point2polygon(t, this);
      return n = n.reverse(), [e, n];
    }
    if (t instanceof o.Circle || t instanceof o.Line || t instanceof o.Segment || t instanceof o.Arc) {
      let [e, n] = o.Distance.shape2polygon(t, this);
      return n = n.reverse(), [e, n];
    }
    if (t instanceof o.Polygon) {
      let e = [Number.POSITIVE_INFINITY, new o.Segment()], n, i;
      for (let s of this.edges) {
        let a = e[0];
        [n, i] = o.Distance.shape2planarSet(s.shape, t.edges, a), o.Utils.LT(n, a) && (e = [n, i]);
      }
      return e;
    }
  }
  intersect(t) {
    if (t instanceof o.Point)
      return this.contains(t) ? [t] : [];
    if (t instanceof o.Line)
      return cn(t, this);
    if (t instanceof o.Circle)
      return yl(t, this);
    if (t instanceof o.Segment)
      return fo(t, this);
    if (t instanceof o.Arc)
      return co(t, this);
    if (t instanceof o.Polygon)
      return fc(t, this);
  }
  translate(t) {
    let e = new Ie();
    for (let n of this.faces)
      e.addFace(n.shapes.map((i) => i.translate(t)));
    return e;
  }
  rotate(t = 0, e = new o.Point()) {
    let n = new Ie();
    for (let i of this.faces)
      n.addFace(i.shapes.map((s) => s.rotate(t, e)));
    return n;
  }
  transform(t = new o.Matrix()) {
    let e = new Ie();
    for (let n of this.faces)
      e.addFace(n.shapes.map((i) => i.transform(t)));
    return e;
  }
  toJSON() {
    return [...this.faces].map((t) => t.toJSON());
  }
  toArray() {
    return [...this.faces].map((t) => t.toPolygon());
  }
  svg(t = {}) {
    let { stroke: e, strokeWidth: n, fill: i, fillRule: s, fillOpacity: a, id: l, className: f } = t, u = l && l.length > 0 ? `id="${l}"` : "", c = f && f.length > 0 ? `class="${f}"` : "", d = `
<path stroke="${e || "black"}" stroke-width="${n || 1}" fill="${i || "lightcyan"}" fill-rule="${s || "evenodd"}" fill-opacity="${a || 1}" ${u} ${c} d="`;
    for (let g of this.faces)
      d += g.svg();
    return d += `" >
</path>`, d;
  }
}
o.Polygon = Ie;
const Bc = (...r) => new o.Polygon(...r);
o.polygon = Bc;
const { Circle: An, Line: hs, Point: ds, Vector: Cr, Utils: Rn } = o;
class lr {
  constructor(t) {
    this.circle = t;
  }
  get inversion_circle() {
    return this.circle;
  }
  static inversePoint(t, e) {
    const n = new Cr(t.pc, e), i = t.r * t.r, s = n.dot(n);
    return Rn.EQ_0(s) ? new ds(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY) : t.pc.translate(n.multiply(i / s));
  }
  static inverseCircle(t, e) {
    const n = t.pc.distanceTo(e.pc)[0];
    if (Rn.EQ(n, e.r)) {
      let i = t.r * t.r / (2 * e.r), s = new Cr(t.pc, e.pc);
      s = s.normalize();
      let a = t.pc.translate(s.multiply(i));
      return new hs(a, s);
    } else {
      let i = new Cr(t.pc, e.pc), s = t.r * t.r / (i.dot(i) - e.r * e.r), a = t.pc.translate(i.multiply(s)), l = Math.abs(s) * e.r;
      return new An(a, l);
    }
  }
  static inverseLine(t, e) {
    const [n, i] = t.pc.distanceTo(e);
    if (Rn.EQ_0(n))
      return e.clone();
    {
      let s = t.r * t.r / (2 * n), a = new Cr(t.pc, i.end);
      return a = a.multiply(s / n), new An(t.pc.translate(a), s);
    }
  }
  inverse(t) {
    if (t instanceof ds)
      return lr.inversePoint(this.circle, t);
    if (t instanceof An)
      return lr.inverseCircle(this.circle, t);
    if (t instanceof hs)
      return lr.inverseLine(this.circle, t);
  }
}
o.Inversion = lr;
const jc = (r) => new o.Inversion(r);
o.inversion = jc;
class P {
  static point2point(t, e) {
    return t.distanceTo(e);
  }
  static point2line(t, e) {
    let n = t.projectionOn(e);
    return [new o.Vector(t, n).length, new o.Segment(t, n)];
  }
  static point2circle(t, e) {
    let [n, i] = t.distanceTo(e.center);
    if (o.Utils.EQ_0(n))
      return [e.r, new o.Segment(t, e.toArc().start)];
    {
      let s = Math.abs(n - e.r), a = new o.Vector(e.pc, t).normalize().multiply(e.r), l = e.pc.translate(a);
      return [s, new o.Segment(t, l)];
    }
  }
  static point2segment(t, e) {
    if (e.start.equalTo(e.end))
      return P.point2point(t, e.start);
    let n = new o.Vector(e.start, e.end), i = new o.Vector(e.start, t), s = new o.Vector(e.end, t), a = n.dot(i), l = -n.dot(s), f, u;
    if (o.Utils.GE(a, 0) && o.Utils.GE(l, 0)) {
      let c = e.tangentInStart();
      return f = Math.abs(c.cross(i)), u = e.start.translate(c.multiply(c.dot(i))), [f, new o.Segment(t, u)];
    } else
      return a < 0 ? t.distanceTo(e.start) : t.distanceTo(e.end);
  }
  static point2arc(t, e) {
    let n = new o.Circle(e.pc, e.r), i = [], s, a;
    return [s, a] = P.point2circle(t, n), a.end.on(e) && i.push(P.point2circle(t, n)), i.push(P.point2point(t, e.start)), i.push(P.point2point(t, e.end)), P.sort(i), i[0];
  }
  static segment2line(t, e) {
    let n = t.intersect(e);
    if (n.length > 0)
      return [0, new o.Segment(n[0], n[0])];
    let i = [];
    return i.push(P.point2line(t.start, e)), i.push(P.point2line(t.end, e)), P.sort(i), i[0];
  }
  static segment2segment(t, e) {
    let n = _r(t, e);
    if (n.length > 0)
      return [0, new o.Segment(n[0], n[0])];
    let i = [], s, a;
    return [s, a] = P.point2segment(e.start, t), i.push([s, a.reverse()]), [s, a] = P.point2segment(e.end, t), i.push([s, a.reverse()]), i.push(P.point2segment(t.start, e)), i.push(P.point2segment(t.end, e)), P.sort(i), i[0];
  }
  static segment2circle(t, e) {
    let n = t.intersect(e);
    if (n.length > 0)
      return [0, new o.Segment(n[0], n[0])];
    let i = new o.Line(t.ps, t.pe), [s, a] = P.point2line(e.center, i);
    if (o.Utils.GE(s, e.r) && a.end.on(t))
      return P.point2circle(a.end, e);
    {
      let [l, f] = P.point2circle(t.start, e), [u, c] = P.point2circle(t.end, e);
      return o.Utils.LT(l, u) ? [l, f] : [u, c];
    }
  }
  static segment2arc(t, e) {
    let n = t.intersect(e);
    if (n.length > 0)
      return [0, new o.Segment(n[0], n[0])];
    let i = new o.Line(t.ps, t.pe), s = new o.Circle(e.pc, e.r), [a, l] = P.point2line(s.center, i);
    if (o.Utils.GE(a, s.r) && l.end.on(t)) {
      let [d, g] = P.point2circle(l.end, s);
      if (g.end.on(e))
        return [d, g];
    }
    let f = [];
    f.push(P.point2arc(t.start, e)), f.push(P.point2arc(t.end, e));
    let u, c;
    return [u, c] = P.point2segment(e.start, t), f.push([u, c.reverse()]), [u, c] = P.point2segment(e.end, t), f.push([u, c.reverse()]), P.sort(f), f[0];
  }
  static circle2circle(t, e) {
    let n = t.intersect(e);
    if (n.length > 0)
      return [0, new o.Segment(n[0], n[0])];
    if (t.center.equalTo(e.center)) {
      let i = t.toArc(), s = e.toArc();
      return P.point2point(i.start, s.start);
    } else {
      let i = new o.Line(t.center, e.center), s = i.intersect(t), a = i.intersect(e), l = [];
      return l.push(P.point2point(s[0], a[0])), l.push(P.point2point(s[0], a[1])), l.push(P.point2point(s[1], a[0])), l.push(P.point2point(s[1], a[1])), P.sort(l), l[0];
    }
  }
  static circle2line(t, e) {
    let n = t.intersect(e);
    if (n.length > 0)
      return [0, new o.Segment(n[0], n[0])];
    let [i, s] = P.point2line(t.center, e), [a, l] = P.point2circle(s.end, t);
    return l = l.reverse(), [a, l];
  }
  static arc2line(t, e) {
    let n = e.intersect(t);
    if (n.length > 0)
      return [0, new o.Segment(n[0], n[0])];
    let i = new o.Circle(t.center, t.r), [s, a] = P.point2line(i.center, e);
    if (o.Utils.GE(s, i.r)) {
      let [l, f] = P.point2circle(a.end, i);
      if (f.end.on(t))
        return [l, f];
    } else {
      let l = [];
      return l.push(P.point2line(t.start, e)), l.push(P.point2line(t.end, e)), P.sort(l), l[0];
    }
  }
  static arc2circle(t, e) {
    let n = t.intersect(e);
    if (n.length > 0)
      return [0, new o.Segment(n[0], n[0])];
    let i = new o.Circle(t.center, t.r), [s, a] = P.circle2circle(i, e);
    if (a.start.on(t))
      return [s, a];
    {
      let l = [];
      return l.push(P.point2circle(t.start, e)), l.push(P.point2circle(t.end, e)), P.sort(l), l[0];
    }
  }
  static arc2arc(t, e) {
    let n = t.intersect(e);
    if (n.length > 0)
      return [0, new o.Segment(n[0], n[0])];
    let i = new o.Circle(t.center, t.r), s = new o.Circle(e.center, e.r), [a, l] = P.circle2circle(i, s);
    if (l.start.on(t) && l.end.on(e))
      return [a, l];
    {
      let f = [], u, c;
      return [u, c] = P.point2arc(t.start, e), c.end.on(e) && f.push([u, c]), [u, c] = P.point2arc(t.end, e), c.end.on(e) && f.push([u, c]), [u, c] = P.point2arc(e.start, t), c.end.on(t) && f.push([u, c.reverse()]), [u, c] = P.point2arc(e.end, t), c.end.on(t) && f.push([u, c.reverse()]), [u, c] = P.point2point(t.start, e.start), f.push([u, c]), [u, c] = P.point2point(t.start, e.end), f.push([u, c]), [u, c] = P.point2point(t.end, e.start), f.push([u, c]), [u, c] = P.point2point(t.end, e.end), f.push([u, c]), P.sort(f), f[0];
    }
  }
  static point2polygon(t, e) {
    let n = [Number.POSITIVE_INFINITY, new o.Segment()];
    for (let i of e.edges) {
      let [s, a] = i.shape instanceof o.Segment ? P.point2segment(t, i.shape) : P.point2arc(t, i.shape);
      o.Utils.LT(s, n[0]) && (n = [s, a]);
    }
    return n;
  }
  static shape2polygon(t, e) {
    let n = [Number.POSITIVE_INFINITY, new o.Segment()];
    for (let i of e.edges) {
      let [s, a] = t.distanceTo(i.shape);
      o.Utils.LT(s, n[0]) && (n = [s, a]);
    }
    return n;
  }
  static polygon2polygon(t, e) {
    let n = [Number.POSITIVE_INFINITY, new o.Segment()];
    for (let i of t.edges)
      for (let s of e.edges) {
        let [a, l] = i.shape.distanceTo(s.shape);
        o.Utils.LT(a, n[0]) && (n = [a, l]);
      }
    return n;
  }
  static box2box_minmax(t, e) {
    let n = Math.max(Math.max(t.xmin - e.xmax, 0), Math.max(e.xmin - t.xmax, 0)), i = Math.max(Math.max(t.ymin - e.ymax, 0), Math.max(e.ymin - t.ymax, 0)), s = n * n + i * i, a = t.merge(e), l = a.xmax - a.xmin, f = a.ymax - a.ymin, u = l * l + f * f;
    return [s, u];
  }
  static minmax_tree_process_level(t, e, n, i) {
    let s, a;
    for (let c of e)
      [s, a] = P.box2box_minmax(t.box, c.item.key), c.item.value instanceof o.Edge ? i.insert([s, a], c.item.value.shape) : i.insert([s, a], c.item.value), o.Utils.LT(a, n) && (n = a);
    if (e.length === 0)
      return n;
    let l = e.map((c) => c.left.isNil() ? void 0 : c.left).filter((c) => c !== void 0), f = e.map((c) => c.right.isNil() ? void 0 : c.right).filter((c) => c !== void 0), u = [...l, ...f].filter((c) => {
      let [d, g] = P.box2box_minmax(t.box, c.max);
      return o.Utils.LE(d, n);
    });
    return n = P.minmax_tree_process_level(t, u, n, i), n;
  }
  static minmax_tree(t, e, n) {
    let i = new dr(), s = [e.index.root], a = n < Number.POSITIVE_INFINITY ? n * n : Number.POSITIVE_INFINITY;
    return a = P.minmax_tree_process_level(t, s, a, i), i;
  }
  static minmax_tree_calc_distance(t, e, n) {
    let i, s;
    if (e != null && !e.isNil()) {
      if ([i, s] = P.minmax_tree_calc_distance(t, e.left, n), s)
        return [i, s];
      if (o.Utils.LT(i[0], Math.sqrt(e.item.key.low)))
        return [i, !0];
      let [a, l] = P.distance(t, e.item.value);
      return o.Utils.LT(a, i[0]) && (i = [a, l]), [i, s] = P.minmax_tree_calc_distance(t, e.right, i), [i, s];
    }
    return [n, !1];
  }
  static shape2planarSet(t, e, n = Number.POSITIVE_INFINITY) {
    let i = [n, new o.Segment()], s = !1;
    if (e instanceof o.PlanarSet) {
      let a = P.minmax_tree(t, e, n);
      [i, s] = P.minmax_tree_calc_distance(t, a.root, i);
    }
    return i;
  }
  static sort(t) {
    t.sort((e, n) => o.Utils.LT(e[0], n[0]) ? -1 : o.Utils.GT(e[0], n[0]) ? 1 : 0);
  }
  static distance(t, e) {
    return t.distanceTo(e);
  }
}
o.Distance = P;
o.BooleanOperations = Hf;
o.Relations = wc;
var ps = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Uc(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
function Dc(r) {
  var t = r.default;
  if (typeof t == "function") {
    var e = function() {
      return t.apply(this, arguments);
    };
    e.prototype = t.prototype;
  } else
    e = {};
  return Object.defineProperty(e, "__esModule", { value: !0 }), Object.keys(r).forEach(function(n) {
    var i = Object.getOwnPropertyDescriptor(r, n);
    Object.defineProperty(e, n, i.get ? i : {
      enumerable: !0,
      get: function() {
        return r[n];
      }
    });
  }), e;
}
var Nr = function(r) {
  return r && r.Math == Math && r;
}, mt = Nr(typeof globalThis == "object" && globalThis) || Nr(typeof window == "object" && window) || Nr(typeof self == "object" && self) || Nr(typeof ps == "object" && ps) || function() {
  return this;
}() || Function("return this")(), Ue = {}, W = function(r) {
  try {
    return !!r();
  } catch {
    return !0;
  }
}, Vc = W, Et = !Vc(function() {
  return Object.defineProperty({}, 1, { get: function() {
    return 7;
  } })[1] != 7;
}), Gc = W, br = !Gc(function() {
  var r = function() {
  }.bind();
  return typeof r != "function" || r.hasOwnProperty("prototype");
}), qc = br, Mr = Function.prototype.call, Lt = qc ? Mr.bind(Mr) : function() {
  return Mr.apply(Mr, arguments);
}, go = {}, Sl = {}.propertyIsEnumerable, El = Object.getOwnPropertyDescriptor, Wc = El && !Sl.call({ 1: 2 }, 1);
go.f = Wc ? function(t) {
  var e = El(this, t);
  return !!e && e.enumerable;
} : Sl;
var wr = function(r, t) {
  return {
    enumerable: !(r & 1),
    configurable: !(r & 2),
    writable: !(r & 4),
    value: t
  };
}, $l = br, Ol = Function.prototype, zc = Ol.bind, Ri = Ol.call, Yc = $l && zc.bind(Ri, Ri), K = $l ? function(r) {
  return r && Yc(r);
} : function(r) {
  return r && function() {
    return Ri.apply(r, arguments);
  };
}, Il = K, Kc = Il({}.toString), Qc = Il("".slice), De = function(r) {
  return Qc(Kc(r), 8, -1);
}, Hc = K, Xc = W, Jc = De, Ln = Object, Zc = Hc("".split), yo = Xc(function() {
  return !Ln("z").propertyIsEnumerable(0);
}) ? function(r) {
  return Jc(r) == "String" ? Zc(r, "") : Ln(r);
} : Ln, th = TypeError, xr = function(r) {
  if (r == null)
    throw th("Can't call method on " + r);
  return r;
}, eh = yo, rh = xr, Wt = function(r) {
  return eh(rh(r));
}, at = function(r) {
  return typeof r == "function";
}, nh = at, Ct = function(r) {
  return typeof r == "object" ? r !== null : nh(r);
}, Cn = mt, ih = at, oh = function(r) {
  return ih(r) ? r : void 0;
}, zt = function(r, t) {
  return arguments.length < 2 ? oh(Cn[r]) : Cn[r] && Cn[r][t];
}, sh = K, hn = sh({}.isPrototypeOf), ah = zt, lh = ah("navigator", "userAgent") || "", Pl = mt, Nn = lh, vs = Pl.process, gs = Pl.Deno, ys = vs && vs.versions || gs && gs.version, ms = ys && ys.v8, Mt, Zr;
ms && (Mt = ms.split("."), Zr = Mt[0] > 0 && Mt[0] < 4 ? 1 : +(Mt[0] + Mt[1]));
!Zr && Nn && (Mt = Nn.match(/Edge\/(\d+)/), (!Mt || Mt[1] >= 74) && (Mt = Nn.match(/Chrome\/(\d+)/), Mt && (Zr = +Mt[1])));
var mo = Zr, _s = mo, uh = W, Ve = !!Object.getOwnPropertySymbols && !uh(function() {
  var r = Symbol();
  return !String(r) || !(Object(r) instanceof Symbol) || !Symbol.sham && _s && _s < 41;
}), fh = Ve, Tl = fh && !Symbol.sham && typeof Symbol.iterator == "symbol", ch = zt, hh = at, dh = hn, ph = Tl, vh = Object, dn = ph ? function(r) {
  return typeof r == "symbol";
} : function(r) {
  var t = ch("Symbol");
  return hh(t) && dh(t.prototype, vh(r));
}, gh = String, _o = function(r) {
  try {
    return gh(r);
  } catch {
    return "Object";
  }
}, yh = at, mh = _o, _h = TypeError, bo = function(r) {
  if (yh(r))
    return r;
  throw _h(mh(r) + " is not a function");
}, bh = bo, Al = function(r, t) {
  var e = r[t];
  return e == null ? void 0 : bh(e);
}, Mn = Lt, kn = at, Fn = Ct, wh = TypeError, xh = function(r, t) {
  var e, n;
  if (t === "string" && kn(e = r.toString) && !Fn(n = Mn(e, r)) || kn(e = r.valueOf) && !Fn(n = Mn(e, r)) || t !== "string" && kn(e = r.toString) && !Fn(n = Mn(e, r)))
    return n;
  throw wh("Can't convert object to primitive value");
}, ge = { exports: {} }, bs = mt, Sh = Object.defineProperty, wo = function(r, t) {
  try {
    Sh(bs, r, { value: t, configurable: !0, writable: !0 });
  } catch {
    bs[r] = t;
  }
  return t;
}, Eh = mt, $h = wo, ws = "__core-js_shared__", Oh = Eh[ws] || $h(ws, {}), xo = Oh, xs = xo;
(ge.exports = function(r, t) {
  return xs[r] || (xs[r] = t !== void 0 ? t : {});
})("versions", []).push({
  version: "3.24.1",
  mode: "global",
  copyright: "\xA9 2014-2022 Denis Pushkarev (zloirock.ru)",
  license: "https://github.com/zloirock/core-js/blob/v3.24.1/LICENSE",
  source: "https://github.com/zloirock/core-js"
});
var Ih = xr, Ph = Object, Ge = function(r) {
  return Ph(Ih(r));
}, Th = K, Ah = Ge, Rh = Th({}.hasOwnProperty), vt = Object.hasOwn || function(t, e) {
  return Rh(Ah(t), e);
}, Lh = K, Ch = 0, Nh = Math.random(), Mh = Lh(1 .toString), So = function(r) {
  return "Symbol(" + (r === void 0 ? "" : r) + ")_" + Mh(++Ch + Nh, 36);
}, kh = mt, Fh = ge.exports, Ss = vt, Bh = So, Es = Ve, Rl = Tl, xe = Fh("wks"), fe = kh.Symbol, $s = fe && fe.for, jh = Rl ? fe : fe && fe.withoutSetter || Bh, gt = function(r) {
  if (!Ss(xe, r) || !(Es || typeof xe[r] == "string")) {
    var t = "Symbol." + r;
    Es && Ss(fe, r) ? xe[r] = fe[r] : Rl && $s ? xe[r] = $s(t) : xe[r] = jh(t);
  }
  return xe[r];
}, Uh = Lt, Os = Ct, Is = dn, Dh = Al, Vh = xh, Gh = gt, qh = TypeError, Wh = Gh("toPrimitive"), zh = function(r, t) {
  if (!Os(r) || Is(r))
    return r;
  var e = Dh(r, Wh), n;
  if (e) {
    if (t === void 0 && (t = "default"), n = Uh(e, r, t), !Os(n) || Is(n))
      return n;
    throw qh("Can't convert object to primitive value");
  }
  return t === void 0 && (t = "number"), Vh(r, t);
}, Yh = zh, Kh = dn, pn = function(r) {
  var t = Yh(r, "string");
  return Kh(t) ? t : t + "";
}, Qh = mt, Ps = Ct, Li = Qh.document, Hh = Ps(Li) && Ps(Li.createElement), Eo = function(r) {
  return Hh ? Li.createElement(r) : {};
}, Xh = Et, Jh = W, Zh = Eo, Ll = !Xh && !Jh(function() {
  return Object.defineProperty(Zh("div"), "a", {
    get: function() {
      return 7;
    }
  }).a != 7;
}), td = Et, ed = Lt, rd = go, nd = wr, id = Wt, od = pn, sd = vt, ad = Ll, Ts = Object.getOwnPropertyDescriptor;
Ue.f = td ? Ts : function(t, e) {
  if (t = id(t), e = od(e), ad)
    try {
      return Ts(t, e);
    } catch {
    }
  if (sd(t, e))
    return nd(!ed(rd.f, t, e), t[e]);
};
var $t = {}, ld = Et, ud = W, Cl = ld && ud(function() {
  return Object.defineProperty(function() {
  }, "prototype", {
    value: 42,
    writable: !1
  }).prototype != 42;
}), fd = Ct, cd = String, hd = TypeError, Ot = function(r) {
  if (fd(r))
    return r;
  throw hd(cd(r) + " is not an object");
}, dd = Et, pd = Ll, vd = Cl, kr = Ot, As = pn, gd = TypeError, Bn = Object.defineProperty, yd = Object.getOwnPropertyDescriptor, jn = "enumerable", Un = "configurable", Dn = "writable";
$t.f = dd ? vd ? function(t, e, n) {
  if (kr(t), e = As(e), kr(n), typeof t == "function" && e === "prototype" && "value" in n && Dn in n && !n[Dn]) {
    var i = yd(t, e);
    i && i[Dn] && (t[e] = n.value, n = {
      configurable: Un in n ? n[Un] : i[Un],
      enumerable: jn in n ? n[jn] : i[jn],
      writable: !1
    });
  }
  return Bn(t, e, n);
} : Bn : function(t, e, n) {
  if (kr(t), e = As(e), kr(n), pd)
    try {
      return Bn(t, e, n);
    } catch {
    }
  if ("get" in n || "set" in n)
    throw gd("Accessors not supported");
  return "value" in n && (t[e] = n.value), t;
};
var md = Et, _d = $t, bd = wr, Sr = md ? function(r, t, e) {
  return _d.f(r, t, bd(1, e));
} : function(r, t, e) {
  return r[t] = e, r;
}, Nl = { exports: {} }, Ci = Et, wd = vt, Ml = Function.prototype, xd = Ci && Object.getOwnPropertyDescriptor, $o = wd(Ml, "name"), Sd = $o && function() {
}.name === "something", Ed = $o && (!Ci || Ci && xd(Ml, "name").configurable), Er = {
  EXISTS: $o,
  PROPER: Sd,
  CONFIGURABLE: Ed
}, $d = K, Od = at, Ni = xo, Id = $d(Function.toString);
Od(Ni.inspectSource) || (Ni.inspectSource = function(r) {
  return Id(r);
});
var Oo = Ni.inspectSource, Pd = mt, Td = at, Ad = Oo, Rs = Pd.WeakMap, Rd = Td(Rs) && /native code/.test(Ad(Rs)), Ld = ge.exports, Cd = So, Ls = Ld("keys"), vn = function(r) {
  return Ls[r] || (Ls[r] = Cd(r));
}, gn = {}, Nd = Rd, kl = mt, Vn = K, Md = Ct, kd = Sr, Gn = vt, qn = xo, Fd = vn, Bd = gn, Cs = "Object already initialized", Mi = kl.TypeError, jd = kl.WeakMap, tn, pr, en, Ud = function(r) {
  return en(r) ? pr(r) : tn(r, {});
}, Dd = function(r) {
  return function(t) {
    var e;
    if (!Md(t) || (e = pr(t)).type !== r)
      throw Mi("Incompatible receiver, " + r + " required");
    return e;
  };
};
if (Nd || qn.state) {
  var se = qn.state || (qn.state = new jd()), Vd = Vn(se.get), Ns = Vn(se.has), Gd = Vn(se.set);
  tn = function(r, t) {
    if (Ns(se, r))
      throw new Mi(Cs);
    return t.facade = r, Gd(se, r, t), t;
  }, pr = function(r) {
    return Vd(se, r) || {};
  }, en = function(r) {
    return Ns(se, r);
  };
} else {
  var Se = Fd("state");
  Bd[Se] = !0, tn = function(r, t) {
    if (Gn(r, Se))
      throw new Mi(Cs);
    return t.facade = r, kd(r, Se, t), t;
  }, pr = function(r) {
    return Gn(r, Se) ? r[Se] : {};
  }, en = function(r) {
    return Gn(r, Se);
  };
}
var $r = {
  set: tn,
  get: pr,
  has: en,
  enforce: Ud,
  getterFor: Dd
}, qd = W, Wd = at, Fr = vt, ki = Et, zd = Er.CONFIGURABLE, Yd = Oo, Fl = $r, Kd = Fl.enforce, Qd = Fl.get, Wr = Object.defineProperty, Hd = ki && !qd(function() {
  return Wr(function() {
  }, "length", { value: 8 }).length !== 8;
}), Xd = String(String).split("String"), Jd = Nl.exports = function(r, t, e) {
  String(t).slice(0, 7) === "Symbol(" && (t = "[" + String(t).replace(/^Symbol\(([^)]*)\)/, "$1") + "]"), e && e.getter && (t = "get " + t), e && e.setter && (t = "set " + t), (!Fr(r, "name") || zd && r.name !== t) && (ki ? Wr(r, "name", { value: t, configurable: !0 }) : r.name = t), Hd && e && Fr(e, "arity") && r.length !== e.arity && Wr(r, "length", { value: e.arity });
  try {
    e && Fr(e, "constructor") && e.constructor ? ki && Wr(r, "prototype", { writable: !1 }) : r.prototype && (r.prototype = void 0);
  } catch {
  }
  var n = Kd(r);
  return Fr(n, "source") || (n.source = Xd.join(typeof t == "string" ? t : "")), r;
};
Function.prototype.toString = Jd(function() {
  return Wd(this) && Qd(this).source || Yd(this);
}, "toString");
var Zd = at, tp = $t, ep = Nl.exports, rp = wo, re = function(r, t, e, n) {
  n || (n = {});
  var i = n.enumerable, s = n.name !== void 0 ? n.name : t;
  if (Zd(e) && ep(e, s, n), n.global)
    i ? r[t] = e : rp(t, e);
  else {
    try {
      n.unsafe ? r[t] && (i = !0) : delete r[t];
    } catch {
    }
    i ? r[t] = e : tp.f(r, t, {
      value: e,
      enumerable: !1,
      configurable: !n.nonConfigurable,
      writable: !n.nonWritable
    });
  }
  return r;
}, yn = {}, np = Math.ceil, ip = Math.floor, op = Math.trunc || function(t) {
  var e = +t;
  return (e > 0 ? ip : np)(e);
}, sp = op, Io = function(r) {
  var t = +r;
  return t !== t || t === 0 ? 0 : sp(t);
}, ap = Io, lp = Math.max, up = Math.min, Bl = function(r, t) {
  var e = ap(r);
  return e < 0 ? lp(e + t, 0) : up(e, t);
}, fp = Io, cp = Math.min, jl = function(r) {
  return r > 0 ? cp(fp(r), 9007199254740991) : 0;
}, hp = jl, mn = function(r) {
  return hp(r.length);
}, dp = Wt, pp = Bl, vp = mn, Ms = function(r) {
  return function(t, e, n) {
    var i = dp(t), s = vp(i), a = pp(n, s), l;
    if (r && e != e) {
      for (; s > a; )
        if (l = i[a++], l != l)
          return !0;
    } else
      for (; s > a; a++)
        if ((r || a in i) && i[a] === e)
          return r || a || 0;
    return !r && -1;
  };
}, gp = {
  includes: Ms(!0),
  indexOf: Ms(!1)
}, yp = K, Wn = vt, mp = Wt, _p = gp.indexOf, bp = gn, ks = yp([].push), Ul = function(r, t) {
  var e = mp(r), n = 0, i = [], s;
  for (s in e)
    !Wn(bp, s) && Wn(e, s) && ks(i, s);
  for (; t.length > n; )
    Wn(e, s = t[n++]) && (~_p(i, s) || ks(i, s));
  return i;
}, Po = [
  "constructor",
  "hasOwnProperty",
  "isPrototypeOf",
  "propertyIsEnumerable",
  "toLocaleString",
  "toString",
  "valueOf"
], wp = Ul, xp = Po, Sp = xp.concat("length", "prototype");
yn.f = Object.getOwnPropertyNames || function(t) {
  return wp(t, Sp);
};
var _n = {};
_n.f = Object.getOwnPropertySymbols;
var Ep = zt, $p = K, Op = yn, Ip = _n, Pp = Ot, Tp = $p([].concat), Ap = Ep("Reflect", "ownKeys") || function(t) {
  var e = Op.f(Pp(t)), n = Ip.f;
  return n ? Tp(e, n(t)) : e;
}, Fs = vt, Rp = Ap, Lp = Ue, Cp = $t, Dl = function(r, t, e) {
  for (var n = Rp(t), i = Cp.f, s = Lp.f, a = 0; a < n.length; a++) {
    var l = n[a];
    !Fs(r, l) && !(e && Fs(e, l)) && i(r, l, s(t, l));
  }
}, Np = W, Mp = at, kp = /#|\.prototype\./, Or = function(r, t) {
  var e = Bp[Fp(r)];
  return e == Up ? !0 : e == jp ? !1 : Mp(t) ? Np(t) : !!t;
}, Fp = Or.normalize = function(r) {
  return String(r).replace(kp, ".").toLowerCase();
}, Bp = Or.data = {}, jp = Or.NATIVE = "N", Up = Or.POLYFILL = "P", Dp = Or, zn = mt, Vp = Ue.f, Gp = Sr, qp = re, Wp = wo, zp = Dl, Yp = Dp, _t = function(r, t) {
  var e = r.target, n = r.global, i = r.stat, s, a, l, f, u, c;
  if (n ? a = zn : i ? a = zn[e] || Wp(e, {}) : a = (zn[e] || {}).prototype, a)
    for (l in t) {
      if (u = t[l], r.dontCallGetSet ? (c = Vp(a, l), f = c && c.value) : f = a[l], s = Yp(n ? l : e + (i ? "." : "#") + l, r.forced), !s && f !== void 0) {
        if (typeof u == typeof f)
          continue;
        zp(u, f);
      }
      (r.sham || f && f.sham) && Gp(u, "sham", !0), qp(a, l, u, r);
    }
}, Kp = gt, Qp = Kp("toStringTag"), Vl = {};
Vl[Qp] = "z";
var To = String(Vl) === "[object z]", Hp = To, Xp = at, zr = De, Jp = gt, Zp = Jp("toStringTag"), tv = Object, ev = zr(function() {
  return arguments;
}()) == "Arguments", rv = function(r, t) {
  try {
    return r[t];
  } catch {
  }
}, Ao = Hp ? zr : function(r) {
  var t, e, n;
  return r === void 0 ? "Undefined" : r === null ? "Null" : typeof (e = rv(t = tv(r), Zp)) == "string" ? e : ev ? zr(t) : (n = zr(t)) == "Object" && Xp(t.callee) ? "Arguments" : n;
}, nv = Ao, iv = String, Yt = function(r) {
  if (nv(r) === "Symbol")
    throw TypeError("Cannot convert a Symbol value to a string");
  return iv(r);
}, Ro = {}, ov = Ul, sv = Po, Gl = Object.keys || function(t) {
  return ov(t, sv);
}, av = Et, lv = Cl, uv = $t, fv = Ot, cv = Wt, hv = Gl;
Ro.f = av && !lv ? Object.defineProperties : function(t, e) {
  fv(t);
  for (var n = cv(e), i = hv(e), s = i.length, a = 0, l; s > a; )
    uv.f(t, l = i[a++], n[l]);
  return t;
};
var dv = zt, pv = dv("document", "documentElement"), vv = Ot, gv = Ro, Bs = Po, yv = gn, mv = pv, _v = Eo, bv = vn, js = ">", Us = "<", Fi = "prototype", Bi = "script", ql = bv("IE_PROTO"), Yn = function() {
}, Wl = function(r) {
  return Us + Bi + js + r + Us + "/" + Bi + js;
}, Ds = function(r) {
  r.write(Wl("")), r.close();
  var t = r.parentWindow.Object;
  return r = null, t;
}, wv = function() {
  var r = _v("iframe"), t = "java" + Bi + ":", e;
  return r.style.display = "none", mv.appendChild(r), r.src = String(t), e = r.contentWindow.document, e.open(), e.write(Wl("document.F=Object")), e.close(), e.F;
}, Br, Yr = function() {
  try {
    Br = new ActiveXObject("htmlfile");
  } catch {
  }
  Yr = typeof document < "u" ? document.domain && Br ? Ds(Br) : wv() : Ds(Br);
  for (var r = Bs.length; r--; )
    delete Yr[Fi][Bs[r]];
  return Yr();
};
yv[ql] = !0;
var Ir = Object.create || function(t, e) {
  var n;
  return t !== null ? (Yn[Fi] = vv(t), n = new Yn(), Yn[Fi] = null, n[ql] = t) : n = Yr(), e === void 0 ? n : gv.f(n, e);
}, Lo = {}, xv = pn, Sv = $t, Ev = wr, zl = function(r, t, e) {
  var n = xv(t);
  n in r ? Sv.f(r, n, Ev(0, e)) : r[n] = e;
}, Vs = Bl, $v = mn, Ov = zl, Iv = Array, Pv = Math.max, Yl = function(r, t, e) {
  for (var n = $v(r), i = Vs(t, n), s = Vs(e === void 0 ? n : e, n), a = Iv(Pv(s - i, 0)), l = 0; i < s; i++, l++)
    Ov(a, l, r[i]);
  return a.length = l, a;
}, Tv = De, Av = Wt, Kl = yn.f, Rv = Yl, Ql = typeof window == "object" && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [], Lv = function(r) {
  try {
    return Kl(r);
  } catch {
    return Rv(Ql);
  }
};
Lo.f = function(t) {
  return Ql && Tv(t) == "Window" ? Lv(t) : Kl(Av(t));
};
var Co = {}, Cv = gt;
Co.f = Cv;
var Nv = mt, Mv = Nv, Gs = Mv, kv = vt, Fv = Co, Bv = $t.f, Hl = function(r) {
  var t = Gs.Symbol || (Gs.Symbol = {});
  kv(t, r) || Bv(t, r, {
    value: Fv.f(r)
  });
}, jv = Lt, Uv = zt, Dv = gt, Vv = re, Gv = function() {
  var r = Uv("Symbol"), t = r && r.prototype, e = t && t.valueOf, n = Dv("toPrimitive");
  t && !t[n] && Vv(t, n, function(i) {
    return jv(e, this);
  }, { arity: 1 });
}, qv = $t.f, Wv = vt, zv = gt, qs = zv("toStringTag"), No = function(r, t, e) {
  r && !e && (r = r.prototype), r && !Wv(r, qs) && qv(r, qs, { configurable: !0, value: t });
}, Ws = K, Yv = bo, Kv = br, Qv = Ws(Ws.bind), Hv = function(r, t) {
  return Yv(r), t === void 0 ? r : Kv ? Qv(r, t) : function() {
    return r.apply(t, arguments);
  };
}, Xv = De, Mo = Array.isArray || function(t) {
  return Xv(t) == "Array";
}, Jv = K, Zv = W, Xl = at, tg = Ao, eg = zt, rg = Oo, Jl = function() {
}, ng = [], Zl = eg("Reflect", "construct"), ko = /^\s*(?:class|function)\b/, ig = Jv(ko.exec), og = !ko.exec(Jl), Qe = function(t) {
  if (!Xl(t))
    return !1;
  try {
    return Zl(Jl, ng, t), !0;
  } catch {
    return !1;
  }
}, tu = function(t) {
  if (!Xl(t))
    return !1;
  switch (tg(t)) {
    case "AsyncFunction":
    case "GeneratorFunction":
    case "AsyncGeneratorFunction":
      return !1;
  }
  try {
    return og || !!ig(ko, rg(t));
  } catch {
    return !0;
  }
};
tu.sham = !0;
var eu = !Zl || Zv(function() {
  var r;
  return Qe(Qe.call) || !Qe(Object) || !Qe(function() {
    r = !0;
  }) || r;
}) ? tu : Qe, zs = Mo, sg = eu, ag = Ct, lg = gt, ug = lg("species"), Ys = Array, fg = function(r) {
  var t;
  return zs(r) && (t = r.constructor, sg(t) && (t === Ys || zs(t.prototype)) ? t = void 0 : ag(t) && (t = t[ug], t === null && (t = void 0))), t === void 0 ? Ys : t;
}, cg = fg, ru = function(r, t) {
  return new (cg(r))(t === 0 ? 0 : t);
}, hg = Hv, dg = K, pg = yo, vg = Ge, gg = mn, yg = ru, Ks = dg([].push), Xt = function(r) {
  var t = r == 1, e = r == 2, n = r == 3, i = r == 4, s = r == 6, a = r == 7, l = r == 5 || s;
  return function(f, u, c, d) {
    for (var g = vg(f), S = pg(g), m = hg(u, c), _ = gg(S), I = 0, b = d || yg, $ = t ? b(f, _) : e || a ? b(f, 0) : void 0, h, p; _ > I; I++)
      if ((l || I in S) && (h = S[I], p = m(h, I, g), r))
        if (t)
          $[I] = p;
        else if (p)
          switch (r) {
            case 3:
              return !0;
            case 5:
              return h;
            case 6:
              return I;
            case 2:
              Ks($, h);
          }
        else
          switch (r) {
            case 4:
              return !1;
            case 7:
              Ks($, h);
          }
    return s ? -1 : n || i ? i : $;
  };
}, mg = {
  forEach: Xt(0),
  map: Xt(1),
  filter: Xt(2),
  some: Xt(3),
  every: Xt(4),
  find: Xt(5),
  findIndex: Xt(6),
  filterReject: Xt(7)
}, bn = _t, Fo = mt, Bo = Lt, _g = K, Ne = Et, Me = Ve, bg = W, ht = vt, wg = hn, ji = Ot, wn = Wt, jo = pn, xg = Yt, Ui = wr, vr = Ir, nu = Gl, Sg = yn, iu = Lo, Eg = _n, ou = Ue, su = $t, $g = Ro, au = go, Kn = re, Uo = ge.exports, Og = vn, lu = gn, Qs = So, Ig = gt, Pg = Co, Tg = Hl, Ag = Gv, Rg = No, uu = $r, xn = mg.forEach, wt = Og("hidden"), Sn = "Symbol", gr = "prototype", Lg = uu.set, Hs = uu.getterFor(Sn), Rt = Object[gr], ce = Fo.Symbol, rr = ce && ce[gr], Cg = Fo.TypeError, Qn = Fo.QObject, fu = ou.f, Zt = su.f, cu = iu.f, Ng = au.f, hu = _g([].push), qt = Uo("symbols"), Pr = Uo("op-symbols"), Mg = Uo("wks"), Di = !Qn || !Qn[gr] || !Qn[gr].findChild, Vi = Ne && bg(function() {
  return vr(Zt({}, "a", {
    get: function() {
      return Zt(this, "a", { value: 7 }).a;
    }
  })).a != 7;
}) ? function(r, t, e) {
  var n = fu(Rt, t);
  n && delete Rt[t], Zt(r, t, e), n && r !== Rt && Zt(Rt, t, n);
} : Zt, Hn = function(r, t) {
  var e = qt[r] = vr(rr);
  return Lg(e, {
    type: Sn,
    tag: r,
    description: t
  }), Ne || (e.description = t), e;
}, En = function(t, e, n) {
  t === Rt && En(Pr, e, n), ji(t);
  var i = jo(e);
  return ji(n), ht(qt, i) ? (n.enumerable ? (ht(t, wt) && t[wt][i] && (t[wt][i] = !1), n = vr(n, { enumerable: Ui(0, !1) })) : (ht(t, wt) || Zt(t, wt, Ui(1, {})), t[wt][i] = !0), Vi(t, i, n)) : Zt(t, i, n);
}, Do = function(t, e) {
  ji(t);
  var n = wn(e), i = nu(n).concat(vu(n));
  return xn(i, function(s) {
    (!Ne || Bo(Gi, n, s)) && En(t, s, n[s]);
  }), t;
}, kg = function(t, e) {
  return e === void 0 ? vr(t) : Do(vr(t), e);
}, Gi = function(t) {
  var e = jo(t), n = Bo(Ng, this, e);
  return this === Rt && ht(qt, e) && !ht(Pr, e) ? !1 : n || !ht(this, e) || !ht(qt, e) || ht(this, wt) && this[wt][e] ? n : !0;
}, du = function(t, e) {
  var n = wn(t), i = jo(e);
  if (!(n === Rt && ht(qt, i) && !ht(Pr, i))) {
    var s = fu(n, i);
    return s && ht(qt, i) && !(ht(n, wt) && n[wt][i]) && (s.enumerable = !0), s;
  }
}, pu = function(t) {
  var e = cu(wn(t)), n = [];
  return xn(e, function(i) {
    !ht(qt, i) && !ht(lu, i) && hu(n, i);
  }), n;
}, vu = function(r) {
  var t = r === Rt, e = cu(t ? Pr : wn(r)), n = [];
  return xn(e, function(i) {
    ht(qt, i) && (!t || ht(Rt, i)) && hu(n, qt[i]);
  }), n;
};
Me || (ce = function() {
  if (wg(rr, this))
    throw Cg("Symbol is not a constructor");
  var t = !arguments.length || arguments[0] === void 0 ? void 0 : xg(arguments[0]), e = Qs(t), n = function(i) {
    this === Rt && Bo(n, Pr, i), ht(this, wt) && ht(this[wt], e) && (this[wt][e] = !1), Vi(this, e, Ui(1, i));
  };
  return Ne && Di && Vi(Rt, e, { configurable: !0, set: n }), Hn(e, t);
}, rr = ce[gr], Kn(rr, "toString", function() {
  return Hs(this).tag;
}), Kn(ce, "withoutSetter", function(r) {
  return Hn(Qs(r), r);
}), au.f = Gi, su.f = En, $g.f = Do, ou.f = du, Sg.f = iu.f = pu, Eg.f = vu, Pg.f = function(r) {
  return Hn(Ig(r), r);
}, Ne && (Zt(rr, "description", {
  configurable: !0,
  get: function() {
    return Hs(this).description;
  }
}), Kn(Rt, "propertyIsEnumerable", Gi, { unsafe: !0 })));
bn({ global: !0, constructor: !0, wrap: !0, forced: !Me, sham: !Me }, {
  Symbol: ce
});
xn(nu(Mg), function(r) {
  Tg(r);
});
bn({ target: Sn, stat: !0, forced: !Me }, {
  useSetter: function() {
    Di = !0;
  },
  useSimple: function() {
    Di = !1;
  }
});
bn({ target: "Object", stat: !0, forced: !Me, sham: !Ne }, {
  create: kg,
  defineProperty: En,
  defineProperties: Do,
  getOwnPropertyDescriptor: du
});
bn({ target: "Object", stat: !0, forced: !Me }, {
  getOwnPropertyNames: pu
});
Ag();
Rg(ce, Sn);
lu[wt] = !0;
var Fg = Ve, gu = Fg && !!Symbol.for && !!Symbol.keyFor, Bg = _t, jg = zt, Ug = vt, Dg = Yt, yu = ge.exports, Vg = gu, Xn = yu("string-to-symbol-registry"), Gg = yu("symbol-to-string-registry");
Bg({ target: "Symbol", stat: !0, forced: !Vg }, {
  for: function(r) {
    var t = Dg(r);
    if (Ug(Xn, t))
      return Xn[t];
    var e = jg("Symbol")(t);
    return Xn[t] = e, Gg[e] = t, e;
  }
});
var qg = _t, Wg = vt, zg = dn, Yg = _o, Kg = ge.exports, Qg = gu, Xs = Kg("symbol-to-string-registry");
qg({ target: "Symbol", stat: !0, forced: !Qg }, {
  keyFor: function(t) {
    if (!zg(t))
      throw TypeError(Yg(t) + " is not a symbol");
    if (Wg(Xs, t))
      return Xs[t];
  }
});
var Hg = br, mu = Function.prototype, Js = mu.apply, Zs = mu.call, Vo = typeof Reflect == "object" && Reflect.apply || (Hg ? Zs.bind(Js) : function() {
  return Zs.apply(Js, arguments);
}), Xg = K, _u = Xg([].slice), Jg = _t, bu = zt, wu = Vo, Zg = Lt, Tr = K, xu = W, ty = Mo, ey = at, ry = Ct, ta = dn, Su = _u, ny = Ve, ee = bu("JSON", "stringify"), jr = Tr(/./.exec), ea = Tr("".charAt), iy = Tr("".charCodeAt), oy = Tr("".replace), sy = Tr(1 .toString), ay = /[\uD800-\uDFFF]/g, ra = /^[\uD800-\uDBFF]$/, na = /^[\uDC00-\uDFFF]$/, ia = !ny || xu(function() {
  var r = bu("Symbol")();
  return ee([r]) != "[null]" || ee({ a: r }) != "{}" || ee(Object(r)) != "{}";
}), oa = xu(function() {
  return ee("\uDF06\uD834") !== '"\\udf06\\ud834"' || ee("\uDEAD") !== '"\\udead"';
}), ly = function(r, t) {
  var e = Su(arguments), n = t;
  if (!(!ry(t) && r === void 0 || ta(r)))
    return ty(t) || (t = function(i, s) {
      if (ey(n) && (s = Zg(n, this, i, s)), !ta(s))
        return s;
    }), e[1] = t, wu(ee, null, e);
}, uy = function(r, t, e) {
  var n = ea(e, t - 1), i = ea(e, t + 1);
  return jr(ra, r) && !jr(na, i) || jr(na, r) && !jr(ra, n) ? "\\u" + sy(iy(r, 0), 16) : r;
};
ee && Jg({ target: "JSON", stat: !0, arity: 3, forced: ia || oa }, {
  stringify: function(t, e, n) {
    var i = Su(arguments), s = wu(ia ? ly : ee, null, i);
    return oa && typeof s == "string" ? oy(s, ay, uy) : s;
  }
});
var fy = _t, cy = Ve, hy = W, Eu = _n, dy = Ge, py = !cy || hy(function() {
  Eu.f(1);
});
fy({ target: "Object", stat: !0, forced: py }, {
  getOwnPropertySymbols: function(t) {
    var e = Eu.f;
    return e ? e(dy(t)) : [];
  }
});
var vy = _t, gy = Et, yy = mt, Ur = K, my = vt, _y = at, by = hn, wy = Yt, xy = $t.f, Sy = Dl, Gt = yy.Symbol, ae = Gt && Gt.prototype;
if (gy && _y(Gt) && (!("description" in ae) || Gt().description !== void 0)) {
  var sa = {}, Dr = function() {
    var t = arguments.length < 1 || arguments[0] === void 0 ? void 0 : wy(arguments[0]), e = by(ae, this) ? new Gt(t) : t === void 0 ? Gt() : Gt(t);
    return t === "" && (sa[e] = !0), e;
  };
  Sy(Dr, Gt), Dr.prototype = ae, ae.constructor = Dr;
  var Ey = String(Gt("test")) == "Symbol(test)", $y = Ur(ae.toString), Oy = Ur(ae.valueOf), Iy = /^Symbol\((.*)\)[^)]+$/, Py = Ur("".replace), Ty = Ur("".slice);
  xy(ae, "description", {
    configurable: !0,
    get: function() {
      var t = Oy(this), e = $y(t);
      if (my(sa, t))
        return "";
      var n = Ey ? Ty(e, 7, -1) : Py(e, Iy, "$1");
      return n === "" ? void 0 : n;
    }
  }), vy({ global: !0, constructor: !0, forced: !0 }, {
    Symbol: Dr
  });
}
var Ay = Hl;
Ay("iterator");
var Ry = TypeError, Ly = 9007199254740991, Cy = function(r) {
  if (r > Ly)
    throw Ry("Maximum allowed index exceeded");
  return r;
}, Ny = W, My = gt, ky = mo, Fy = My("species"), By = function(r) {
  return ky >= 51 || !Ny(function() {
    var t = [], e = t.constructor = {};
    return e[Fy] = function() {
      return { foo: 1 };
    }, t[r](Boolean).foo !== 1;
  });
}, jy = _t, Uy = W, Dy = Mo, Vy = Ct, Gy = Ge, qy = mn, aa = Cy, la = zl, Wy = ru, zy = By, Yy = gt, Ky = mo, $u = Yy("isConcatSpreadable"), Qy = Ky >= 51 || !Uy(function() {
  var r = [];
  return r[$u] = !1, r.concat()[0] !== r;
}), Hy = zy("concat"), Xy = function(r) {
  if (!Vy(r))
    return !1;
  var t = r[$u];
  return t !== void 0 ? !!t : Dy(r);
}, Jy = !Qy || !Hy;
jy({ target: "Array", proto: !0, arity: 1, forced: Jy }, {
  concat: function(t) {
    var e = Gy(this), n = Wy(e, 0), i = 0, s, a, l, f, u;
    for (s = -1, l = arguments.length; s < l; s++)
      if (u = s === -1 ? e : arguments[s], Xy(u))
        for (f = qy(u), aa(i + f), a = 0; a < f; a++, i++)
          a in u && la(n, i, u[a]);
      else
        aa(i + 1), la(n, i++, u);
    return n.length = i, n;
  }
});
var Zy = gt, tm = Ir, em = $t.f, qi = Zy("unscopables"), Wi = Array.prototype;
Wi[qi] == null && em(Wi, qi, {
  configurable: !0,
  value: tm(null)
});
var rm = function(r) {
  Wi[qi][r] = !0;
}, Go = {}, nm = W, Ou = !nm(function() {
  function r() {
  }
  return r.prototype.constructor = null, Object.getPrototypeOf(new r()) !== r.prototype;
}), im = vt, om = at, sm = Ge, am = vn, lm = Ou, ua = am("IE_PROTO"), zi = Object, um = zi.prototype, $n = lm ? zi.getPrototypeOf : function(r) {
  var t = sm(r);
  if (im(t, ua))
    return t[ua];
  var e = t.constructor;
  return om(e) && t instanceof e ? e.prototype : t instanceof zi ? um : null;
}, fm = W, cm = at, fa = $n, hm = re, dm = gt, Yi = dm("iterator"), Iu = !1, ve, Jn, Zn;
[].keys && (Zn = [].keys(), "next" in Zn ? (Jn = fa(fa(Zn)), Jn !== Object.prototype && (ve = Jn)) : Iu = !0);
var pm = ve == null || fm(function() {
  var r = {};
  return ve[Yi].call(r) !== r;
});
pm && (ve = {});
cm(ve[Yi]) || hm(ve, Yi, function() {
  return this;
});
var Pu = {
  IteratorPrototype: ve,
  BUGGY_SAFARI_ITERATORS: Iu
}, vm = Pu.IteratorPrototype, gm = Ir, ym = wr, mm = No, _m = Go, bm = function() {
  return this;
}, wm = function(r, t, e, n) {
  var i = t + " Iterator";
  return r.prototype = gm(vm, { next: ym(+!n, e) }), mm(r, i, !1), _m[i] = bm, r;
}, xm = at, Sm = String, Em = TypeError, $m = function(r) {
  if (typeof r == "object" || xm(r))
    return r;
  throw Em("Can't set " + Sm(r) + " as a prototype");
}, Om = K, Im = Ot, Pm = $m, Tm = Object.setPrototypeOf || ("__proto__" in {} ? function() {
  var r = !1, t = {}, e;
  try {
    e = Om(Object.getOwnPropertyDescriptor(Object.prototype, "__proto__").set), e(t, []), r = t instanceof Array;
  } catch {
  }
  return function(i, s) {
    return Im(i), Pm(s), r ? e(i, s) : i.__proto__ = s, i;
  };
}() : void 0), Am = _t, Rm = Lt, Tu = Er, Lm = at, Cm = wm, ca = $n, ha = Tm, Nm = No, Mm = Sr, ti = re, km = gt, Fm = Go, Au = Pu, Bm = Tu.PROPER, jm = Tu.CONFIGURABLE, da = Au.IteratorPrototype, Vr = Au.BUGGY_SAFARI_ITERATORS, He = km("iterator"), pa = "keys", Xe = "values", va = "entries", Um = function() {
  return this;
}, Ru = function(r, t, e, n, i, s, a) {
  Cm(e, t, n);
  var l = function(b) {
    if (b === i && g)
      return g;
    if (!Vr && b in c)
      return c[b];
    switch (b) {
      case pa:
        return function() {
          return new e(this, b);
        };
      case Xe:
        return function() {
          return new e(this, b);
        };
      case va:
        return function() {
          return new e(this, b);
        };
    }
    return function() {
      return new e(this);
    };
  }, f = t + " Iterator", u = !1, c = r.prototype, d = c[He] || c["@@iterator"] || i && c[i], g = !Vr && d || l(i), S = t == "Array" && c.entries || d, m, _, I;
  if (S && (m = ca(S.call(new r())), m !== Object.prototype && m.next && (ca(m) !== da && (ha ? ha(m, da) : Lm(m[He]) || ti(m, He, Um)), Nm(m, f, !0))), Bm && i == Xe && d && d.name !== Xe && (jm ? Mm(c, "name", Xe) : (u = !0, g = function() {
    return Rm(d, this);
  })), i)
    if (_ = {
      values: l(Xe),
      keys: s ? g : l(pa),
      entries: l(va)
    }, a)
      for (I in _)
        (Vr || u || !(I in c)) && ti(c, I, _[I]);
    else
      Am({ target: t, proto: !0, forced: Vr || u }, _);
  return c[He] !== g && ti(c, He, g, { name: i }), Fm[t] = g, _;
}, Dm = Wt, qo = rm, ga = Go, Lu = $r, Vm = $t.f, Gm = Ru, qm = Et, Cu = "Array Iterator", Wm = Lu.set, zm = Lu.getterFor(Cu), Ym = Gm(Array, "Array", function(r, t) {
  Wm(this, {
    type: Cu,
    target: Dm(r),
    index: 0,
    kind: t
  });
}, function() {
  var r = zm(this), t = r.target, e = r.kind, n = r.index++;
  return !t || n >= t.length ? (r.target = void 0, { value: void 0, done: !0 }) : e == "keys" ? { value: n, done: !1 } : e == "values" ? { value: t[n], done: !1 } : { value: [n, t[n]], done: !1 };
}, "values"), ya = ga.Arguments = ga.Array;
qo("keys");
qo("values");
qo("entries");
if (qm && ya.name !== "values")
  try {
    Vm(ya, "name", { value: "values" });
  } catch {
  }
var Km = W, Qm = function(r, t) {
  var e = [][r];
  return !!e && Km(function() {
    e.call(null, t || function() {
      return 1;
    }, 1);
  });
}, Hm = _t, Xm = K, Jm = yo, Zm = Wt, t_ = Qm, e_ = Xm([].join), r_ = Jm != Object, n_ = t_("join", ",");
Hm({ target: "Array", proto: !0, forced: r_ || !n_ }, {
  join: function(t) {
    return e_(Zm(this), t === void 0 ? "," : t);
  }
});
var i_ = _t, o_ = W, s_ = Wt, Nu = Ue.f, Mu = Et, a_ = o_(function() {
  Nu(1);
}), l_ = !Mu || a_;
i_({ target: "Object", stat: !0, forced: l_, sham: !Mu }, {
  getOwnPropertyDescriptor: function(t, e) {
    return Nu(s_(t), e);
  }
});
var u_ = _t, f_ = W, c_ = Ge, ku = $n, h_ = Ou, d_ = f_(function() {
  ku(1);
});
u_({ target: "Object", stat: !0, forced: d_, sham: !h_ }, {
  getPrototypeOf: function(t) {
    return ku(c_(t));
  }
});
var p_ = To, v_ = Ao, g_ = p_ ? {}.toString : function() {
  return "[object " + v_(this) + "]";
}, y_ = To, m_ = re, __ = g_;
y_ || m_(Object.prototype, "toString", __, { unsafe: !0 });
var ma = vt, b_ = function(r) {
  return r !== void 0 && (ma(r, "value") || ma(r, "writable"));
}, w_ = _t, x_ = Lt, S_ = Ct, E_ = Ot, $_ = b_, O_ = Ue, I_ = $n;
function Fu(r, t) {
  var e = arguments.length < 3 ? r : arguments[2], n, i;
  if (E_(r) === e)
    return r[t];
  if (n = O_.f(r, t), n)
    return $_(n) ? n.value : n.get === void 0 ? void 0 : x_(n.get, e);
  if (S_(i = I_(r)))
    return Fu(i, t, e);
}
w_({ target: "Reflect", stat: !0 }, {
  get: Fu
});
var Wo = K, P_ = Io, T_ = Yt, A_ = xr, R_ = Wo("".charAt), _a = Wo("".charCodeAt), L_ = Wo("".slice), ba = function(r) {
  return function(t, e) {
    var n = T_(A_(t)), i = P_(e), s = n.length, a, l;
    return i < 0 || i >= s ? r ? "" : void 0 : (a = _a(n, i), a < 55296 || a > 56319 || i + 1 === s || (l = _a(n, i + 1)) < 56320 || l > 57343 ? r ? R_(n, i) : a : r ? L_(n, i, i + 2) : (a - 55296 << 10) + (l - 56320) + 65536);
  };
}, Bu = {
  codeAt: ba(!1),
  charAt: ba(!0)
}, C_ = Bu.charAt, N_ = Yt, ju = $r, M_ = Ru, Uu = "String Iterator", k_ = ju.set, F_ = ju.getterFor(Uu);
M_(String, "String", function(r) {
  k_(this, {
    type: Uu,
    string: N_(r),
    index: 0
  });
}, function() {
  var t = F_(this), e = t.string, n = t.index, i;
  return n >= e.length ? { value: void 0, done: !0 } : (i = C_(e, n), t.index += i.length, { value: i, done: !1 });
});
var B_ = Ot, Du = function() {
  var r = B_(this), t = "";
  return r.hasIndices && (t += "d"), r.global && (t += "g"), r.ignoreCase && (t += "i"), r.multiline && (t += "m"), r.dotAll && (t += "s"), r.unicode && (t += "u"), r.unicodeSets && (t += "v"), r.sticky && (t += "y"), t;
}, zo = W, j_ = mt, Yo = j_.RegExp, Ko = zo(function() {
  var r = Yo("a", "y");
  return r.lastIndex = 2, r.exec("abcd") != null;
}), U_ = Ko || zo(function() {
  return !Yo("a", "y").sticky;
}), D_ = Ko || zo(function() {
  var r = Yo("^r", "gy");
  return r.lastIndex = 2, r.exec("str") != null;
}), Vu = {
  BROKEN_CARET: D_,
  MISSED_STICKY: U_,
  UNSUPPORTED_Y: Ko
}, V_ = W, G_ = mt, q_ = G_.RegExp, W_ = V_(function() {
  var r = q_(".", "s");
  return !(r.dotAll && r.exec(`
`) && r.flags === "s");
}), z_ = W, Y_ = mt, K_ = Y_.RegExp, Q_ = z_(function() {
  var r = K_("(?<a>b)", "g");
  return r.exec("b").groups.a !== "b" || "b".replace(r, "$<a>c") !== "bc";
}), Pe = Lt, On = K, H_ = Yt, X_ = Du, J_ = Vu, Z_ = ge.exports, tb = Ir, eb = $r.get, rb = W_, nb = Q_, ib = Z_("native-string-replace", String.prototype.replace), rn = RegExp.prototype.exec, Ki = rn, ob = On("".charAt), sb = On("".indexOf), ab = On("".replace), ei = On("".slice), Qi = function() {
  var r = /a/, t = /b*/g;
  return Pe(rn, r, "a"), Pe(rn, t, "a"), r.lastIndex !== 0 || t.lastIndex !== 0;
}(), Gu = J_.BROKEN_CARET, Hi = /()??/.exec("")[1] !== void 0, lb = Qi || Hi || Gu || rb || nb;
lb && (Ki = function(t) {
  var e = this, n = eb(e), i = H_(t), s = n.raw, a, l, f, u, c, d, g;
  if (s)
    return s.lastIndex = e.lastIndex, a = Pe(Ki, s, i), e.lastIndex = s.lastIndex, a;
  var S = n.groups, m = Gu && e.sticky, _ = Pe(X_, e), I = e.source, b = 0, $ = i;
  if (m && (_ = ab(_, "y", ""), sb(_, "g") === -1 && (_ += "g"), $ = ei(i, e.lastIndex), e.lastIndex > 0 && (!e.multiline || e.multiline && ob(i, e.lastIndex - 1) !== `
`) && (I = "(?: " + I + ")", $ = " " + $, b++), l = new RegExp("^(?:" + I + ")", _)), Hi && (l = new RegExp("^" + I + "$(?!\\s)", _)), Qi && (f = e.lastIndex), u = Pe(rn, m ? l : e, $), m ? u ? (u.input = ei(u.input, b), u[0] = ei(u[0], b), u.index = e.lastIndex, e.lastIndex += u[0].length) : e.lastIndex = 0 : Qi && u && (e.lastIndex = e.global ? u.index + u[0].length : f), Hi && u && u.length > 1 && Pe(ib, u[0], l, function() {
    for (c = 1; c < arguments.length - 2; c++)
      arguments[c] === void 0 && (u[c] = void 0);
  }), u && S)
    for (u.groups = d = tb(null), c = 0; c < S.length; c++)
      g = S[c], d[g[0]] = u[g[1]];
  return u;
});
var In = Ki, ub = _t, wa = In;
ub({ target: "RegExp", proto: !0, forced: /./.exec !== wa }, {
  exec: wa
});
var xa = K, Sa = re, fb = In, Ea = W, qu = gt, cb = Sr, hb = qu("species"), ri = RegExp.prototype, db = function(r, t, e, n) {
  var i = qu(r), s = !Ea(function() {
    var u = {};
    return u[i] = function() {
      return 7;
    }, ""[r](u) != 7;
  }), a = s && !Ea(function() {
    var u = !1, c = /a/;
    return r === "split" && (c = {}, c.constructor = {}, c.constructor[hb] = function() {
      return c;
    }, c.flags = "", c[i] = /./[i]), c.exec = function() {
      return u = !0, null;
    }, c[i](""), !u;
  });
  if (!s || !a || e) {
    var l = xa(/./[i]), f = t(i, ""[r], function(u, c, d, g, S) {
      var m = xa(u), _ = c.exec;
      return _ === fb || _ === ri.exec ? s && !S ? { done: !0, value: l(c, d, g) } : { done: !0, value: m(d, c, g) } : { done: !1 };
    });
    Sa(String.prototype, r, f[0]), Sa(ri, i, f[1]);
  }
  n && cb(ri[i], "sham", !0);
}, pb = Ct, vb = De, gb = gt, yb = gb("match"), mb = function(r) {
  var t;
  return pb(r) && ((t = r[yb]) !== void 0 ? !!t : vb(r) == "RegExp");
}, _b = eu, bb = _o, wb = TypeError, Wu = function(r) {
  if (_b(r))
    return r;
  throw wb(bb(r) + " is not a constructor");
}, $a = Ot, xb = Wu, Sb = gt, Eb = Sb("species"), $b = function(r, t) {
  var e = $a(r).constructor, n;
  return e === void 0 || (n = $a(e)[Eb]) == null ? t : xb(n);
}, Ob = Bu.charAt, Ib = function(r, t, e) {
  return t + (e ? Ob(r, t).length : 1);
}, Oa = Lt, Pb = Ot, Tb = at, Ab = De, Rb = In, Lb = TypeError, Cb = function(r, t) {
  var e = r.exec;
  if (Tb(e)) {
    var n = Oa(e, r, t);
    return n !== null && Pb(n), n;
  }
  if (Ab(r) === "RegExp")
    return Oa(Rb, r, t);
  throw Lb("RegExp#exec called on incompatible receiver");
}, Nb = Vo, Je = Lt, Qo = K, Mb = db, kb = mb, Fb = Ot, Ia = xr, Bb = $b, jb = Ib, Ub = jl, ni = Yt, Db = Al, Pa = Yl, Ta = Cb, Vb = In, Gb = Vu, qb = W, Ee = Gb.UNSUPPORTED_Y, Aa = 4294967295, Wb = Math.min, zu = [].push, zb = Qo(/./.exec), $e = Qo(zu), Ze = Qo("".slice), Yb = !qb(function() {
  var r = /(?:)/, t = r.exec;
  r.exec = function() {
    return t.apply(this, arguments);
  };
  var e = "ab".split(r);
  return e.length !== 2 || e[0] !== "a" || e[1] !== "b";
});
Mb("split", function(r, t, e) {
  var n;
  return "abbc".split(/(b)*/)[1] == "c" || "test".split(/(?:)/, -1).length != 4 || "ab".split(/(?:ab)*/).length != 2 || ".".split(/(.?)(.?)/).length != 4 || ".".split(/()()/).length > 1 || "".split(/.?/).length ? n = function(i, s) {
    var a = ni(Ia(this)), l = s === void 0 ? Aa : s >>> 0;
    if (l === 0)
      return [];
    if (i === void 0)
      return [a];
    if (!kb(i))
      return Je(t, a, i, l);
    for (var f = [], u = (i.ignoreCase ? "i" : "") + (i.multiline ? "m" : "") + (i.unicode ? "u" : "") + (i.sticky ? "y" : ""), c = 0, d = new RegExp(i.source, u + "g"), g, S, m; (g = Je(Vb, d, a)) && (S = d.lastIndex, !(S > c && ($e(f, Ze(a, c, g.index)), g.length > 1 && g.index < a.length && Nb(zu, f, Pa(g, 1)), m = g[0].length, c = S, f.length >= l))); )
      d.lastIndex === g.index && d.lastIndex++;
    return c === a.length ? (m || !zb(d, "")) && $e(f, "") : $e(f, Ze(a, c)), f.length > l ? Pa(f, 0, l) : f;
  } : "0".split(void 0, 0).length ? n = function(i, s) {
    return i === void 0 && s === 0 ? [] : Je(t, this, i, s);
  } : n = t, [
    function(s, a) {
      var l = Ia(this), f = s == null ? void 0 : Db(s, r);
      return f ? Je(f, s, l, a) : Je(n, ni(l), s, a);
    },
    function(i, s) {
      var a = Fb(this), l = ni(i), f = e(n, a, l, s, n !== t);
      if (f.done)
        return f.value;
      var u = Bb(a, RegExp), c = a.unicode, d = (a.ignoreCase ? "i" : "") + (a.multiline ? "m" : "") + (a.unicode ? "u" : "") + (Ee ? "g" : "y"), g = new u(Ee ? "^(?:" + a.source + ")" : a, d), S = s === void 0 ? Aa : s >>> 0;
      if (S === 0)
        return [];
      if (l.length === 0)
        return Ta(g, l) === null ? [l] : [];
      for (var m = 0, _ = 0, I = []; _ < l.length; ) {
        g.lastIndex = Ee ? 0 : _;
        var b = Ta(g, Ee ? Ze(l, _) : l), $;
        if (b === null || ($ = Wb(Ub(g.lastIndex + (Ee ? _ : 0)), l.length)) === m)
          _ = jb(l, _, c);
        else {
          if ($e(I, Ze(l, m, _)), I.length === S)
            return I;
          for (var h = 1; h <= b.length - 1; h++)
            if ($e(I, b[h]), I.length === S)
              return I;
          _ = m = $;
        }
      }
      return $e(I, Ze(l, m)), I;
    }
  ];
}, !Yb, Ee);
var Yu = `	
\v\f\r \xA0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF`, Kb = K, Qb = xr, Hb = Yt, Xb = Yu, Ra = Kb("".replace), nn = "[" + Xb + "]", Jb = RegExp("^" + nn + nn + "*"), Zb = RegExp(nn + nn + "*$"), ii = function(r) {
  return function(t) {
    var e = Hb(Qb(t));
    return r & 1 && (e = Ra(e, Jb, "")), r & 2 && (e = Ra(e, Zb, "")), e;
  };
}, t0 = {
  start: ii(1),
  end: ii(2),
  trim: ii(3)
}, e0 = Er.PROPER, r0 = W, La = Yu, Ca = "\u200B\x85\u180E", n0 = function(r) {
  return r0(function() {
    return !!La[r]() || Ca[r]() !== Ca || e0 && La[r].name !== r;
  });
}, i0 = _t, o0 = t0.trim, s0 = n0;
i0({ target: "String", proto: !0, forced: s0("trim") }, {
  trim: function() {
    return o0(this);
  }
});
var a0 = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
}, l0 = Eo, oi = l0("span").classList, Na = oi && oi.constructor && oi.constructor.prototype, u0 = Na === Object.prototype ? void 0 : Na, Ma = mt, Ku = a0, f0 = u0, nr = Ym, si = Sr, Qu = gt, ai = Qu("iterator"), ka = Qu("toStringTag"), li = nr.values, Hu = function(r, t) {
  if (r) {
    if (r[ai] !== li)
      try {
        si(r, ai, li);
      } catch {
        r[ai] = li;
      }
    if (r[ka] || si(r, ka, t), Ku[t]) {
      for (var e in nr)
        if (r[e] !== nr[e])
          try {
            si(r, e, nr[e]);
          } catch {
            r[e] = nr[e];
          }
    }
  }
};
for (var ui in Ku)
  Hu(Ma[ui] && Ma[ui].prototype, ui);
Hu(f0, "DOMTokenList");
var c0 = Et, h0 = Er.EXISTS, Xu = K, d0 = $t.f, Ju = Function.prototype, p0 = Xu(Ju.toString), Zu = /function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/, v0 = Xu(Zu.exec), g0 = "name";
c0 && !h0 && d0(Ju, g0, {
  configurable: !0,
  get: function() {
    try {
      return v0(Zu, p0(this))[1];
    } catch {
      return "";
    }
  }
});
var y0 = _t, m0 = W, _0 = Lo.f, b0 = m0(function() {
  return !Object.getOwnPropertyNames(1);
});
y0({ target: "Object", stat: !0, forced: b0 }, {
  getOwnPropertyNames: _0
});
var tf = K, w0 = bo, x0 = Ct, S0 = vt, Fa = _u, E0 = br, ef = Function, $0 = tf([].concat), O0 = tf([].join), fi = {}, I0 = function(r, t, e) {
  if (!S0(fi, t)) {
    for (var n = [], i = 0; i < t; i++)
      n[i] = "a[" + i + "]";
    fi[t] = ef("C,a", "return new C(" + O0(n, ",") + ")");
  }
  return fi[t](r, e);
}, P0 = E0 ? ef.bind : function(t) {
  var e = w0(this), n = e.prototype, i = Fa(arguments, 1), s = function() {
    var l = $0(i, Fa(arguments));
    return this instanceof s ? I0(e, l.length, l) : e.apply(t, l);
  };
  return x0(n) && (s.prototype = n), s;
}, T0 = _t, A0 = zt, ci = Vo, R0 = P0, Ba = Wu, L0 = Ot, ja = Ct, C0 = Ir, rf = W, Ho = A0("Reflect", "construct"), N0 = Object.prototype, M0 = [].push, nf = rf(function() {
  function r() {
  }
  return !(Ho(function() {
  }, [], r) instanceof r);
}), of = !rf(function() {
  Ho(function() {
  });
}), Ua = nf || of;
T0({ target: "Reflect", stat: !0, forced: Ua, sham: Ua }, {
  construct: function(t, e) {
    Ba(t), L0(e);
    var n = arguments.length < 3 ? t : Ba(arguments[2]);
    if (of && !nf)
      return Ho(t, e, n);
    if (t == n) {
      switch (e.length) {
        case 0:
          return new t();
        case 1:
          return new t(e[0]);
        case 2:
          return new t(e[0], e[1]);
        case 3:
          return new t(e[0], e[1], e[2]);
        case 4:
          return new t(e[0], e[1], e[2], e[3]);
      }
      var i = [null];
      return ci(M0, i, e), new (ci(R0, t, i))();
    }
    var s = n.prototype, a = C0(ja(s) ? s : N0), l = ci(t, a, e);
    return ja(l) ? l : a;
  }
});
var k0 = Lt, F0 = vt, B0 = hn, j0 = Du, Da = RegExp.prototype, U0 = function(r) {
  var t = r.flags;
  return t === void 0 && !("flags" in Da) && !F0(r, "flags") && B0(Da, r) ? k0(j0, r) : t;
}, D0 = Er.PROPER, V0 = re, G0 = Ot, Va = Yt, q0 = W, W0 = U0, Xo = "toString", z0 = RegExp.prototype, sf = z0[Xo], Y0 = q0(function() {
  return sf.call({ source: "a", flags: "b" }) != "/a/b";
}), K0 = D0 && sf.name != Xo;
(Y0 || K0) && V0(RegExp.prototype, Xo, function() {
  var t = G0(this), e = Va(t.source), n = Va(W0(t));
  return "/" + e + "/" + n;
}, { unsafe: !0 });
var af = { exports: {} };
(function(r, t) {
  (function(e, n, i) {
    var s = Object.getOwnPropertyNames, a = Object.defineProperty, l = Function.prototype.toString, f = Object.create, u = Object.prototype.hasOwnProperty, c = /^\n?function\s?(\w*)?_?\(/;
    function d(b, $, h) {
      return typeof $ == "function" && (h = $, $ = g(h).replace(/_$/, "")), a(b, $, { configurable: !0, writable: !0, value: h });
    }
    function g(b) {
      return typeof b != "function" ? "" : "name" in b ? b.name : l.call(b).match(c)[1];
    }
    var S = function() {
      var b = { value: { writable: !0, value: i } }, $ = "return function(k){if(k===s)return l}", h = f(null), p = function() {
        var w = Math.random().toString(36).slice(2);
        return w in h ? p() : h[w] = w;
      }, v = p(), E = function(w) {
        if (u.call(w, v))
          return w[v];
        if (!Object.isExtensible(w))
          throw new TypeError("Object must be extensible");
        var T = f(null);
        return a(w, v, { value: T }), T;
      };
      d(Object, function(T) {
        var L = s(T);
        return u.call(T, v) && L.splice(L.indexOf(v), 1), L;
      });
      function O() {
        var w = p(), T = {};
        this.unlock = function(L) {
          var k = E(L);
          if (u.call(k, w))
            return k[w](T);
          var tt = f(null, b);
          return a(k, w, {
            value: new Function("s", "l", $)(T, tt)
          }), tt;
        };
      }
      return d(O.prototype, function(T) {
        return this.unlock(T).value;
      }), d(O.prototype, function(T, L) {
        this.unlock(T).value = L;
      }), O;
    }(), m = function(b) {
      var $ = function(y) {
        if (y == null || typeof y != "object" && typeof y != "function")
          throw new TypeError("Invalid WeakMap key");
      }, h = function(y, R) {
        var M = b.unlock(y);
        if (M.value)
          throw new TypeError("Object is already a WeakMap");
        M.value = R;
      }, p = function(y) {
        var R = b.unlock(y).value;
        if (!R)
          throw new TypeError("WeakMap is not generic");
        return R;
      }, v = function(y, R) {
        R !== null && typeof R == "object" && typeof R.forEach == "function" && R.forEach(function(M, H) {
          M instanceof Array && M.length === 2 && w.call(y, R[H][0], R[H][1]);
        });
      };
      function E(y) {
        if (this === e || this == null || this === E.prototype)
          return new E(y);
        h(this, new S()), v(this, y);
      }
      function O(y) {
        $(y);
        var R = p(this).get(y);
        return R === n ? i : R;
      }
      function w(y, R) {
        $(y), p(this).set(y, R === i ? n : R);
      }
      function T(y) {
        return $(y), p(this).get(y) !== i;
      }
      function L(y) {
        $(y);
        var R = p(this), M = R.get(y) !== i;
        return R.set(y, i), M;
      }
      function k() {
        return p(this), "[object WeakMap]";
      }
      try {
        var st = ("return " + L).replace("e_", "\\u0065"), tt = new Function("unwrap", "validate", st)(p, $);
      } catch {
        var tt = L;
      }
      var st = ("" + Object).split("Object"), x = function() {
        return st[0] + g(this) + st[1];
      };
      d(x, x);
      var C = { __proto__: [] } instanceof Array ? function(y) {
        y.__proto__ = x;
      } : function(y) {
        d(y, x);
      };
      return C(E), [k, O, w, T, tt].forEach(function(y) {
        d(E.prototype, y), C(y);
      }), E;
    }(new S()), _ = Object.create ? function() {
      return /* @__PURE__ */ Object.create(null);
    } : function() {
      return {};
    };
    function I(b) {
      var $ = new m();
      b || (b = _);
      function h(p, v) {
        return v || arguments.length === 2 ? $.set(p, v) : (v = $.get(p), v === i && (v = b(p), $.set(p, v))), v;
      }
      return h;
    }
    r.exports = m, m.createStorage = I, e.WeakMap && (e.WeakMap.createStorage = I);
  })((0, eval)("this"));
})(af);
var Q0 = H0(af.exports);
function H0(r) {
  return r && r.__esModule ? r : { default: r };
}
function X0() {
  if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham)
    return !1;
  if (typeof Proxy == "function")
    return !0;
  try {
    return Date.prototype.toString.call(Reflect.construct(Date, [], function() {
    })), !0;
  } catch {
    return !1;
  }
}
function Kr(r, t, e) {
  return X0() ? Kr = Reflect.construct : Kr = function(i, s, a) {
    var l = [null];
    l.push.apply(l, s);
    var f = Function.bind.apply(i, l), u = new f();
    return a && Xi(u, a.prototype), u;
  }, Kr.apply(null, arguments);
}
function Xi(r, t) {
  return Xi = Object.setPrototypeOf || function(n, i) {
    return n.__proto__ = i, n;
  }, Xi(r, t);
}
function J0(r, t) {
  if (!(r instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function Ga(r, t) {
  for (var e = 0; e < t.length; e++) {
    var n = t[e];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(r, n.key, n);
  }
}
function qa(r, t, e) {
  return t && Ga(r.prototype, t), e && Ga(r, e), r;
}
function Z0(r, t, e) {
  return t in r ? Object.defineProperty(r, t, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : r[t] = e, r;
}
var tr = new Q0.default(), Jo = /* @__PURE__ */ function() {
  qa(r, [{
    key: "get",
    value: function(e) {
      return this.getHiddenProperty("error")[e];
    }
  }, {
    key: "set",
    value: function(e, n) {
      this.getHiddenProperty("error")[e] = n;
    }
  }, {
    key: "defineHiddenProperty",
    value: function(e, n) {
      var i = tr.has(this) ? tr.get(this) : {};
      i[e] = n, tr.set(this, i);
    }
  }, {
    key: "getHiddenProperty",
    value: function(e, n) {
      return tr.has(this) ? tr.get(this)[e] : n;
    }
  }, {
    key: "stack",
    get: function() {
      return this.getHiddenProperty("error").stack;
    },
    set: function(e) {
      this.getHiddenProperty("error").stack = e;
    }
  }, {
    key: "name",
    get: function() {
      return this.getHiddenProperty("error").name;
    },
    set: function(e) {
      this.getHiddenProperty("error").name = e;
    }
  }, {
    key: "message",
    get: function() {
      return this.getHiddenProperty("error").message;
    },
    set: function(e) {
      this.getHiddenProperty("error").message = e;
    }
  }]);
  function r() {
    J0(this, r);
    for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++)
      e[n] = arguments[n];
    var i = Kr(Error, e);
    i.name = this.constructor.name, this.defineHiddenProperty("error", i);
  }
  return qa(r, [{
    key: "toJSON",
    value: function() {
      if (!r.searchPrototype)
        return {
          stack: this.stack,
          message: this.message,
          name: this.name
        };
      for (var e = {}, n = this, i = [n]; n = Object.getPrototypeOf(n); )
        i.push(n);
      for (var s = 0, a = i; s < a.length; s++) {
        var l = a[s], f = !0, u = !1, c = void 0;
        try {
          for (var d = Object.getOwnPropertyNames(l)[Symbol.iterator](), g; !(f = (g = d.next()).done); f = !0) {
            var S = g.value;
            if (!e.hasOwnProperty(S)) {
              var m = Object.getOwnPropertyDescriptor(l, S);
              if (m) {
                var _ = m.get ? m.get.call(this) : m.value;
                if (l.isPrototypeOf(_))
                  continue;
                typeof _ != "function" && (e[S] = _);
              }
            }
          }
        } catch (I) {
          u = !0, c = I;
        } finally {
          try {
            !f && d.return != null && d.return();
          } finally {
            if (u)
              throw c;
          }
        }
      }
      return e;
    }
  }]), r;
}();
Z0(Jo, "searchPrototype", !1);
Object.setPrototypeOf(Jo.prototype, Error.prototype);
var tw = Jo, lf = ew(tw);
function ew(r) {
  return r && r.__esModule ? r : { default: r };
}
function Qr(r) {
  return typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? Qr = function(e) {
    return typeof e;
  } : Qr = function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Qr(r);
}
function rw(r, t) {
  if (!(r instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function nw(r, t) {
  return t && (Qr(t) === "object" || typeof t == "function") ? t : iw(r);
}
function iw(r) {
  if (r === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return r;
}
function Wa(r, t) {
  for (var e = 0; e < t.length; e++) {
    var n = t[e];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(r, n.key, n);
  }
}
function ow(r, t, e) {
  return t && Wa(r.prototype, t), e && Wa(r, e), r;
}
function sw(r, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  r.prototype = Object.create(t && t.prototype, { constructor: { value: r, writable: !0, configurable: !0 } }), t && Ji(r, t);
}
function Ji(r, t) {
  return Ji = Object.setPrototypeOf || function(n, i) {
    return n.__proto__ = i, n;
  }, Ji(r, t);
}
function Ae(r, t, e) {
  return typeof Reflect < "u" && Reflect.get ? Ae = Reflect.get : Ae = function(i, s, a) {
    var l = aw(i, s);
    if (!!l) {
      var f = Object.getOwnPropertyDescriptor(l, s);
      return f.get ? f.get.call(a) : f.value;
    }
  }, Ae(r, t, e || r);
}
function aw(r, t) {
  for (; !Object.prototype.hasOwnProperty.call(r, t) && (r = ue(r), r !== null); )
    ;
  return r;
}
function ue(r) {
  return ue = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
    return e.__proto__ || Object.getPrototypeOf(e);
  }, ue(r);
}
function Zo(r, t, e) {
  return t in r ? Object.defineProperty(r, t, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : r[t] = e, r;
}
var Pn = /* @__PURE__ */ function(r) {
  sw(t, r), ow(t, [{
    key: "serializeNonError",
    value: function(n) {
      try {
        return JSON.stringify(n, null, 2);
      } catch {
      }
      return n;
    }
  }, {
    key: "resolveStackFromError",
    value: function(n) {
      return n === this && t.globalStackProperty === "stack" ? Ae(ue(t.prototype), "stack", this) : n[t.globalStackProperty];
    }
  }, {
    key: "getLongStack",
    value: function() {
      var n = [], i = !0, s = !1, a = void 0;
      try {
        for (var l = this.causes()[Symbol.iterator](), f; !(i = (f = l.next()).done); i = !0) {
          var u = f.value;
          u instanceof t ? n.push(u.getLongStack()) : u instanceof Error ? n.push(this.resolveStackFromError(u)) : n.push(this.serializeNonError(u));
        }
      } catch (d) {
        s = !0, a = d;
      } finally {
        try {
          !i && l.return != null && l.return();
        } finally {
          if (s)
            throw a;
        }
      }
      var c = t.indent + n.join(`
`).split(`
`).join(`
` + t.indent);
      return (this.resolveStackFromError(this) + `
` + c).trim();
    }
  }, {
    key: "messages",
    value: function() {
      var n = [Ae(ue(t.prototype), "message", this)], i = !0, s = !1, a = void 0;
      try {
        for (var l = this.causes()[Symbol.iterator](), f; !(i = (f = l.next()).done); i = !0) {
          var u = f.value;
          u instanceof t ? n = n.concat(u.messages()) : u instanceof Error ? n.push(u.message) : n.push(u);
        }
      } catch (c) {
        s = !0, a = c;
      } finally {
        try {
          !i && l.return != null && l.return();
        } finally {
          if (s)
            throw a;
        }
      }
      return n;
    }
  }, {
    key: "cause",
    value: function() {
      var n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
      return this.getHiddenProperty("causes", [])[n];
    }
  }, {
    key: "causes",
    value: function() {
      return this.getHiddenProperty("causes", []);
    }
  }, {
    key: "stack",
    get: function() {
      if (this.getHiddenProperty("useBase"))
        return Ae(ue(t.prototype), "stack", this);
      this.defineHiddenProperty("useBase", !0);
      var n = this.getLongStack();
      return this.defineHiddenProperty("useBase", !1), n;
    }
  }]);
  function t(e) {
    var n;
    rw(this, t), n = nw(this, ue(t).call(this, e));
    for (var i = arguments.length, s = new Array(i > 1 ? i - 1 : 0), a = 1; a < i; a++)
      s[a - 1] = arguments[a];
    return n.defineHiddenProperty("causes", s), n;
  }
  return t;
}(lf.default);
Zo(Pn, "indent", "    ");
Zo(Pn, "globalStackProperty", "stack");
Zo(Pn, "Exception", lf.default);
var lw = Pn;
function hi(r) {
  return r instanceof o.Point || r instanceof o.Vector || r instanceof o.Segment || r instanceof o.Line || r instanceof o.Box || r instanceof o.Polygon || r instanceof o.Face;
}
function uw(r) {
  return r instanceof o.Point;
}
function fw(r) {
  return r instanceof o.Vector;
}
function cw(r) {
  return r instanceof o.Segment;
}
function hw(r) {
  return r instanceof o.Line;
}
function di(r) {
  return r instanceof o.Box;
}
function dw(r) {
  return r instanceof o.Polygon;
}
const pw = {}, vw = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: pw
}, Symbol.toStringTag, { value: "Module" })), gw = /* @__PURE__ */ Dc(vw);
var ts = typeof Map == "function" && Map.prototype, pi = Object.getOwnPropertyDescriptor && ts ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null, on = ts && pi && typeof pi.get == "function" ? pi.get : null, yw = ts && Map.prototype.forEach, es = typeof Set == "function" && Set.prototype, vi = Object.getOwnPropertyDescriptor && es ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null, sn = es && vi && typeof vi.get == "function" ? vi.get : null, mw = es && Set.prototype.forEach, _w = typeof WeakMap == "function" && WeakMap.prototype, ur = _w ? WeakMap.prototype.has : null, bw = typeof WeakSet == "function" && WeakSet.prototype, fr = bw ? WeakSet.prototype.has : null, ww = typeof WeakRef == "function" && WeakRef.prototype, za = ww ? WeakRef.prototype.deref : null, xw = Boolean.prototype.valueOf, Sw = Object.prototype.toString, Ew = Function.prototype.toString, $w = String.prototype.match, rs = String.prototype.slice, te = String.prototype.replace, Ow = String.prototype.toUpperCase, Ya = String.prototype.toLowerCase, uf = RegExp.prototype.test, Ka = Array.prototype.concat, Bt = Array.prototype.join, Iw = Array.prototype.slice, Qa = Math.floor, Zi = typeof BigInt == "function" ? BigInt.prototype.valueOf : null, gi = Object.getOwnPropertySymbols, to = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? Symbol.prototype.toString : null, ke = typeof Symbol == "function" && typeof Symbol.iterator == "object", yt = typeof Symbol == "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === ke ? "object" : "symbol") ? Symbol.toStringTag : null, ff = Object.prototype.propertyIsEnumerable, Ha = (typeof Reflect == "function" ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(r) {
  return r.__proto__;
} : null);
function Xa(r, t) {
  if (r === 1 / 0 || r === -1 / 0 || r !== r || r && r > -1e3 && r < 1e3 || uf.call(/e/, t))
    return t;
  var e = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
  if (typeof r == "number") {
    var n = r < 0 ? -Qa(-r) : Qa(r);
    if (n !== r) {
      var i = String(n), s = rs.call(t, i.length + 1);
      return te.call(i, e, "$&_") + "." + te.call(te.call(s, /([0-9]{3})/g, "$&_"), /_$/, "");
    }
  }
  return te.call(t, e, "$&_");
}
var eo = gw, Ja = eo.custom, Za = hf(Ja) ? Ja : null, Pw = function r(t, e, n, i) {
  var s = e || {};
  if (Jt(s, "quoteStyle") && s.quoteStyle !== "single" && s.quoteStyle !== "double")
    throw new TypeError('option "quoteStyle" must be "single" or "double"');
  if (Jt(s, "maxStringLength") && (typeof s.maxStringLength == "number" ? s.maxStringLength < 0 && s.maxStringLength !== 1 / 0 : s.maxStringLength !== null))
    throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
  var a = Jt(s, "customInspect") ? s.customInspect : !0;
  if (typeof a != "boolean" && a !== "symbol")
    throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
  if (Jt(s, "indent") && s.indent !== null && s.indent !== "	" && !(parseInt(s.indent, 10) === s.indent && s.indent > 0))
    throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
  if (Jt(s, "numericSeparator") && typeof s.numericSeparator != "boolean")
    throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
  var l = s.numericSeparator;
  if (typeof t > "u")
    return "undefined";
  if (t === null)
    return "null";
  if (typeof t == "boolean")
    return t ? "true" : "false";
  if (typeof t == "string")
    return pf(t, s);
  if (typeof t == "number") {
    if (t === 0)
      return 1 / 0 / t > 0 ? "0" : "-0";
    var f = String(t);
    return l ? Xa(t, f) : f;
  }
  if (typeof t == "bigint") {
    var u = String(t) + "n";
    return l ? Xa(t, u) : u;
  }
  var c = typeof s.depth > "u" ? 5 : s.depth;
  if (typeof n > "u" && (n = 0), n >= c && c > 0 && typeof t == "object")
    return ro(t) ? "[Array]" : "[Object]";
  var d = zw(s, n);
  if (typeof i > "u")
    i = [];
  else if (df(i, t) >= 0)
    return "[Circular]";
  function g(st, x, C) {
    if (x && (i = Iw.call(i), i.push(x)), C) {
      var y = {
        depth: s.depth
      };
      return Jt(s, "quoteStyle") && (y.quoteStyle = s.quoteStyle), r(st, y, n + 1, i);
    }
    return r(st, s, n + 1, i);
  }
  if (typeof t == "function" && !tl(t)) {
    var S = Fw(t), m = Gr(t, g);
    return "[Function" + (S ? ": " + S : " (anonymous)") + "]" + (m.length > 0 ? " { " + Bt.call(m, ", ") + " }" : "");
  }
  if (hf(t)) {
    var _ = ke ? te.call(String(t), /^(Symbol\(.*\))_[^)]*$/, "$1") : to.call(t);
    return typeof t == "object" && !ke ? er(_) : _;
  }
  if (Gw(t)) {
    for (var I = "<" + Ya.call(String(t.nodeName)), b = t.attributes || [], $ = 0; $ < b.length; $++)
      I += " " + b[$].name + "=" + cf(Tw(b[$].value), "double", s);
    return I += ">", t.childNodes && t.childNodes.length && (I += "..."), I += "</" + Ya.call(String(t.nodeName)) + ">", I;
  }
  if (ro(t)) {
    if (t.length === 0)
      return "[]";
    var h = Gr(t, g);
    return d && !Ww(h) ? "[" + no(h, d) + "]" : "[ " + Bt.call(h, ", ") + " ]";
  }
  if (Rw(t)) {
    var p = Gr(t, g);
    return !("cause" in Error.prototype) && "cause" in t && !ff.call(t, "cause") ? "{ [" + String(t) + "] " + Bt.call(Ka.call("[cause]: " + g(t.cause), p), ", ") + " }" : p.length === 0 ? "[" + String(t) + "]" : "{ [" + String(t) + "] " + Bt.call(p, ", ") + " }";
  }
  if (typeof t == "object" && a) {
    if (Za && typeof t[Za] == "function" && eo)
      return eo(t, { depth: c - n });
    if (a !== "symbol" && typeof t.inspect == "function")
      return t.inspect();
  }
  if (Bw(t)) {
    var v = [];
    return yw.call(t, function(st, x) {
      v.push(g(x, t, !0) + " => " + g(st, t));
    }), el("Map", on.call(t), v, d);
  }
  if (Dw(t)) {
    var E = [];
    return mw.call(t, function(st) {
      E.push(g(st, t));
    }), el("Set", sn.call(t), E, d);
  }
  if (jw(t))
    return yi("WeakMap");
  if (Vw(t))
    return yi("WeakSet");
  if (Uw(t))
    return yi("WeakRef");
  if (Cw(t))
    return er(g(Number(t)));
  if (Mw(t))
    return er(g(Zi.call(t)));
  if (Nw(t))
    return er(xw.call(t));
  if (Lw(t))
    return er(g(String(t)));
  if (!Aw(t) && !tl(t)) {
    var O = Gr(t, g), w = Ha ? Ha(t) === Object.prototype : t instanceof Object || t.constructor === Object, T = t instanceof Object ? "" : "null prototype", L = !w && yt && Object(t) === t && yt in t ? rs.call(ne(t), 8, -1) : T ? "Object" : "", k = w || typeof t.constructor != "function" ? "" : t.constructor.name ? t.constructor.name + " " : "", tt = k + (L || T ? "[" + Bt.call(Ka.call([], L || [], T || []), ": ") + "] " : "");
    return O.length === 0 ? tt + "{}" : d ? tt + "{" + no(O, d) + "}" : tt + "{ " + Bt.call(O, ", ") + " }";
  }
  return String(t);
};
function cf(r, t, e) {
  var n = (e.quoteStyle || t) === "double" ? '"' : "'";
  return n + r + n;
}
function Tw(r) {
  return te.call(String(r), /"/g, "&quot;");
}
function ro(r) {
  return ne(r) === "[object Array]" && (!yt || !(typeof r == "object" && yt in r));
}
function Aw(r) {
  return ne(r) === "[object Date]" && (!yt || !(typeof r == "object" && yt in r));
}
function tl(r) {
  return ne(r) === "[object RegExp]" && (!yt || !(typeof r == "object" && yt in r));
}
function Rw(r) {
  return ne(r) === "[object Error]" && (!yt || !(typeof r == "object" && yt in r));
}
function Lw(r) {
  return ne(r) === "[object String]" && (!yt || !(typeof r == "object" && yt in r));
}
function Cw(r) {
  return ne(r) === "[object Number]" && (!yt || !(typeof r == "object" && yt in r));
}
function Nw(r) {
  return ne(r) === "[object Boolean]" && (!yt || !(typeof r == "object" && yt in r));
}
function hf(r) {
  if (ke)
    return r && typeof r == "object" && r instanceof Symbol;
  if (typeof r == "symbol")
    return !0;
  if (!r || typeof r != "object" || !to)
    return !1;
  try {
    return to.call(r), !0;
  } catch {
  }
  return !1;
}
function Mw(r) {
  if (!r || typeof r != "object" || !Zi)
    return !1;
  try {
    return Zi.call(r), !0;
  } catch {
  }
  return !1;
}
var kw = Object.prototype.hasOwnProperty || function(r) {
  return r in this;
};
function Jt(r, t) {
  return kw.call(r, t);
}
function ne(r) {
  return Sw.call(r);
}
function Fw(r) {
  if (r.name)
    return r.name;
  var t = $w.call(Ew.call(r), /^function\s*([\w$]+)/);
  return t ? t[1] : null;
}
function df(r, t) {
  if (r.indexOf)
    return r.indexOf(t);
  for (var e = 0, n = r.length; e < n; e++)
    if (r[e] === t)
      return e;
  return -1;
}
function Bw(r) {
  if (!on || !r || typeof r != "object")
    return !1;
  try {
    on.call(r);
    try {
      sn.call(r);
    } catch {
      return !0;
    }
    return r instanceof Map;
  } catch {
  }
  return !1;
}
function jw(r) {
  if (!ur || !r || typeof r != "object")
    return !1;
  try {
    ur.call(r, ur);
    try {
      fr.call(r, fr);
    } catch {
      return !0;
    }
    return r instanceof WeakMap;
  } catch {
  }
  return !1;
}
function Uw(r) {
  if (!za || !r || typeof r != "object")
    return !1;
  try {
    return za.call(r), !0;
  } catch {
  }
  return !1;
}
function Dw(r) {
  if (!sn || !r || typeof r != "object")
    return !1;
  try {
    sn.call(r);
    try {
      on.call(r);
    } catch {
      return !0;
    }
    return r instanceof Set;
  } catch {
  }
  return !1;
}
function Vw(r) {
  if (!fr || !r || typeof r != "object")
    return !1;
  try {
    fr.call(r, fr);
    try {
      ur.call(r, ur);
    } catch {
      return !0;
    }
    return r instanceof WeakSet;
  } catch {
  }
  return !1;
}
function Gw(r) {
  return !r || typeof r != "object" ? !1 : typeof HTMLElement < "u" && r instanceof HTMLElement ? !0 : typeof r.nodeName == "string" && typeof r.getAttribute == "function";
}
function pf(r, t) {
  if (r.length > t.maxStringLength) {
    var e = r.length - t.maxStringLength, n = "... " + e + " more character" + (e > 1 ? "s" : "");
    return pf(rs.call(r, 0, t.maxStringLength), t) + n;
  }
  var i = te.call(te.call(r, /(['\\])/g, "\\$1"), /[\x00-\x1f]/g, qw);
  return cf(i, "single", t);
}
function qw(r) {
  var t = r.charCodeAt(0), e = {
    8: "b",
    9: "t",
    10: "n",
    12: "f",
    13: "r"
  }[t];
  return e ? "\\" + e : "\\x" + (t < 16 ? "0" : "") + Ow.call(t.toString(16));
}
function er(r) {
  return "Object(" + r + ")";
}
function yi(r) {
  return r + " { ? }";
}
function el(r, t, e, n) {
  var i = n ? no(e, n) : Bt.call(e, ", ");
  return r + " (" + t + ") {" + i + "}";
}
function Ww(r) {
  for (var t = 0; t < r.length; t++)
    if (df(r[t], `
`) >= 0)
      return !1;
  return !0;
}
function zw(r, t) {
  var e;
  if (r.indent === "	")
    e = "	";
  else if (typeof r.indent == "number" && r.indent > 0)
    e = Bt.call(Array(r.indent + 1), " ");
  else
    return null;
  return {
    base: e,
    prev: Bt.call(Array(t + 1), e)
  };
}
function no(r, t) {
  if (r.length === 0)
    return "";
  var e = `
` + t.prev + t.base;
  return e + Bt.call(r, "," + e) + `
` + t.prev;
}
function Gr(r, t) {
  var e = ro(r), n = [];
  if (e) {
    n.length = r.length;
    for (var i = 0; i < r.length; i++)
      n[i] = Jt(r, i) ? t(r[i], r) : "";
  }
  var s = typeof gi == "function" ? gi(r) : [], a;
  if (ke) {
    a = {};
    for (var l = 0; l < s.length; l++)
      a["$" + s[l]] = s[l];
  }
  for (var f in r)
    !Jt(r, f) || e && String(Number(f)) === f && f < r.length || ke && a["$" + f] instanceof Symbol || (uf.call(/[^\w$]/, f) ? n.push(t(f, r) + ": " + t(r[f], r)) : n.push(f + ": " + t(r[f], r)));
  if (typeof gi == "function")
    for (var u = 0; u < s.length; u++)
      ff.call(r, s[u]) && n.push("[" + t(s[u]) + "]: " + t(r[s[u]], r));
  return n;
}
const mi = Pw, qr = Symbol("CoordinateSystem"), _i = Symbol("RAW");
class St {
  constructor(t, e) {
    be(this, "positive");
    be(this, "name");
    be(this, "embeddings", /* @__PURE__ */ new Map());
    this.positive = t, this.name = e || "unnamed coordinate system";
  }
  defineEmbedding(t, e) {
    e === void 0 && (e = this.positive === t.positive ? new o.Matrix() : new o.Matrix(1, 0, 0, -1)), this.embeddings.set(t, e), t.embeddings.set(this, St.inverse(e));
  }
  point(...t) {
    return this.embed(new o.Point(...t));
  }
  vector(...t) {
    return t = t.map((e) => this.unwrapArgument(e)), this.embed(new o.Vector(...t));
  }
  segment(...t) {
    return t = t.map((e) => this.unwrapArgument(e)), this.embed(new o.Segment(...t));
  }
  line(...t) {
    return t = t.map((e) => this.unwrapArgument(e)), this.embed(new o.Line(...t));
  }
  box(...t) {
    return t = t.map((e) => this.unwrapArgument(e)), this.embed(new o.Box(...t));
  }
  polygon(...t) {
    return t = t.map((e) => this.unwrapArgument(e)), this.embed(new o.Polygon(...t));
  }
  static isCoordinateSystemProxy(t) {
    return qr in t;
  }
  static withoutCoordinateSystem(t) {
    return St.isCoordinateSystemProxy(t) ? t[_i] : t;
  }
  static parent(t) {
    return St.isCoordinateSystemProxy(t) ? t[qr] : null;
  }
  discover(t) {
    if (this.embeddings.has(t))
      return this.embeddings.get(t);
    throw Error("not implemented: discover()");
  }
  createProxy(t) {
    const e = this;
    if (St.parent(t) !== null)
      throw Error("object is already a coordinate system proxy");
    return new Proxy(t, {
      has(i, s) {
        return s === qr || s === _i ? !0 : s in i;
      },
      get(i, s, a) {
        if (s === qr)
          return e;
        if (s === _i)
          return console.assert(!St.isCoordinateSystemProxy(i)), i;
        const l = Reflect.get(i, s, a);
        return s === "toJSON" ? l : typeof l == "function" ? new Proxy(l, {
          apply(f, u, c) {
            try {
              return u = St.withoutCoordinateSystem(u), c = c.map((d) => e.unwrapArgument(d)), e.wrapReturnValue(f.bind(u)(...c));
            } catch (d) {
              throw new lw(`failed to invoke ${f} with arguments ${mi(c)}`, d);
            }
          }
        }) : hi(l) ? e.embed(l) : l;
      }
    });
  }
  embed(t) {
    const e = St.parent(t);
    if (e === this)
      return t;
    if (e === null)
      return this.createProxy(t);
    if (!hi(t))
      throw Error("cannot embed this kind of object into a coordinate system yet");
    const n = e.discover(this);
    if (n === null)
      throw Error("No embedding between these coordinate systems");
    if (console.assert(n.tx != null && n.ty != null && n.a * n.d - n.b * n.c, "Discovered an embedding that is not invertible.", n), uw(t) || cw(t) || dw(t))
      return this.embed(
        St.withoutCoordinateSystem(t).transform(n)
      );
    if (fw(t))
      return this.vector(e.point(0, 0), e.point(t.x, t.y));
    if (hw(t))
      return this.line(t.pt, t.norm);
    if (di(t)) {
      const i = this.unwrapArgument(t.toPoints()), s = this.polygon(i);
      return new Set(i.map((a) => a.x)).size !== 2 || new Set(i.map((a) => a.y)).size !== 2 ? s : s.box;
    }
    throw Error("cannot embed this kind of geometric primitive yet");
  }
  unwrapArgument(t) {
    return this.wrapReturnValue(t, !0);
  }
  wrapReturnValue(t, e = !1) {
    if (hi(t)) {
      let n = this.embed(t);
      if (e && (n = St.withoutCoordinateSystem(n)), di(t) && !di(n))
        throw Error(`cannot automatically convert box ${mi(t)} since it converts to a polygon and thus changed type`);
      return n;
    }
    if (typeof t == "boolean" || typeof t == "number" || typeof t == "string" || t == null)
      return t;
    if (Array.isArray(t))
      return t.map((n) => this.wrapReturnValue(n, e));
    throw Error(`cannot automatically translate ${mi(t)} into this coordinate system yet`);
  }
  static inverse(t) {
    const [e, n, i, s, a, l, f, u, c] = [t.a, t.c, t.tx, t.b, t.d, t.ty, 0, 0, 1], d = [a * c - u * l, s * c - f * l, s * u - f * a, n * c - u * i, e * c - f * i, e * u - f * n, n * l - a * i, e * l - s * i, e * a - s * n], g = e * d[0] - n * d[1] + i * d[2], S = [d[0], -d[3], d[6], -d[1], d[4], -d[7], d[2], -d[5], d[8]].map((_) => _ / g), m = S.map((_) => _ / S[8]);
    return console.assert(m.every((_) => _ != null), `Matrix ${t} must be invertible.`), new o.Matrix(m[0], m[3], m[1], m[4], m[2], m[5]);
  }
}
const rl = Symbol("VIEWPORT");
class Yw {
  constructor(t, e) {
    be(this, "idealCoordinateSystem");
    be(this, "clientCoordinateSystem");
    t === void 0 && (t = new St(!0, "ideal")), e === void 0 && (e = new St(!1, "client"), e.defineEmbedding(t)), this.idealCoordinateSystem = t, this.clientCoordinateSystem = e;
  }
  static use(t) {
    if (t == null) {
      if (t = bf(rl), t === void 0)
        throw Error("Parent component must inject viewport with Viewport.use()");
    } else
      wf(rl, t);
    return {
      viewport: t,
      idealCoordinateSystem: t.idealCoordinateSystem,
      clientCoordinateSystem: t.clientCoordinateSystem
    };
  }
  drag(t) {
    const e = this.idealCoordinateSystem.discover(this.clientCoordinateSystem);
    if (e == null)
      throw Error("cannot drag, coordinate systems not embedded into each other");
    t = this.clientCoordinateSystem.embed(t), e.tx -= t.x, e.ty -= t.y, this.idealCoordinateSystem.defineEmbedding(this.clientCoordinateSystem, e);
  }
  zoom(t, e) {
    let n = this.idealCoordinateSystem.discover(this.clientCoordinateSystem);
    if (n == null)
      throw Error("cannot zoom, coordinate systems not embedded into each other");
    if (e === void 0)
      throw new Error("not implemented: zoom without center");
    {
      const i = this.clientCoordinateSystem.embed(e), s = this.idealCoordinateSystem.embed(i);
      n = n.multiply(new o.Matrix(t, 0, 0, t));
      const a = this.clientCoordinateSystem.vector(i, St.withoutCoordinateSystem(s).transform(n));
      n.tx -= a.x, n.ty -= a.y, this.idealCoordinateSystem.defineEmbedding(this.clientCoordinateSystem, n);
    }
  }
}
var vf = { exports: {} };
(function(r, t) {
  (function(e, n) {
    r.exports = n();
  })(window, function() {
    return function(e) {
      var n = {};
      function i(s) {
        if (n[s])
          return n[s].exports;
        var a = n[s] = { i: s, l: !1, exports: {} };
        return e[s].call(a.exports, a, a.exports, i), a.l = !0, a.exports;
      }
      return i.m = e, i.c = n, i.d = function(s, a, l) {
        i.o(s, a) || Object.defineProperty(s, a, { enumerable: !0, get: l });
      }, i.r = function(s) {
        typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(s, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(s, "__esModule", { value: !0 });
      }, i.t = function(s, a) {
        if (1 & a && (s = i(s)), 8 & a || 4 & a && typeof s == "object" && s && s.__esModule)
          return s;
        var l = /* @__PURE__ */ Object.create(null);
        if (i.r(l), Object.defineProperty(l, "default", { enumerable: !0, value: s }), 2 & a && typeof s != "string")
          for (var f in s)
            i.d(l, f, function(u) {
              return s[u];
            }.bind(null, f));
        return l;
      }, i.n = function(s) {
        var a = s && s.__esModule ? function() {
          return s.default;
        } : function() {
          return s;
        };
        return i.d(a, "a", a), a;
      }, i.o = function(s, a) {
        return Object.prototype.hasOwnProperty.call(s, a);
      }, i.p = "", i(i.s = 9);
    }([function(e, n, i) {
      var s = i(7);
      e.exports = s && function() {
        var a = !1;
        try {
          var l = Object.defineProperty({}, "passive", { get: function() {
            a = !0;
          } });
          window.addEventListener("test", null, l), window.removeEventListener("test", null, l);
        } catch {
          a = !1;
        }
        return a;
      }();
    }, function(e, n, i) {
      var s, a = typeof Reflect == "object" ? Reflect : null, l = a && typeof a.apply == "function" ? a.apply : function(h, p, v) {
        return Function.prototype.apply.call(h, p, v);
      };
      s = a && typeof a.ownKeys == "function" ? a.ownKeys : Object.getOwnPropertySymbols ? function(h) {
        return Object.getOwnPropertyNames(h).concat(Object.getOwnPropertySymbols(h));
      } : function(h) {
        return Object.getOwnPropertyNames(h);
      };
      var f = Number.isNaN || function(h) {
        return h != h;
      };
      function u() {
        u.init.call(this);
      }
      e.exports = u, e.exports.once = function(h, p) {
        return new Promise(function(v, E) {
          function O() {
            w !== void 0 && h.removeListener("error", w), v([].slice.call(arguments));
          }
          var w;
          p !== "error" && (w = function(T) {
            h.removeListener(p, O), E(T);
          }, h.once("error", w)), h.once(p, O);
        });
      }, u.EventEmitter = u, u.prototype._events = void 0, u.prototype._eventsCount = 0, u.prototype._maxListeners = void 0;
      var c = 10;
      function d(h) {
        if (typeof h != "function")
          throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof h);
      }
      function g(h) {
        return h._maxListeners === void 0 ? u.defaultMaxListeners : h._maxListeners;
      }
      function S(h, p, v, E) {
        var O, w, T, L;
        if (d(v), (w = h._events) === void 0 ? (w = h._events = /* @__PURE__ */ Object.create(null), h._eventsCount = 0) : (w.newListener !== void 0 && (h.emit("newListener", p, v.listener ? v.listener : v), w = h._events), T = w[p]), T === void 0)
          T = w[p] = v, ++h._eventsCount;
        else if (typeof T == "function" ? T = w[p] = E ? [v, T] : [T, v] : E ? T.unshift(v) : T.push(v), (O = g(h)) > 0 && T.length > O && !T.warned) {
          T.warned = !0;
          var k = new Error("Possible EventEmitter memory leak detected. " + T.length + " " + String(p) + " listeners added. Use emitter.setMaxListeners() to increase limit");
          k.name = "MaxListenersExceededWarning", k.emitter = h, k.type = p, k.count = T.length, L = k, console && console.warn && console.warn(L);
        }
        return h;
      }
      function m() {
        if (!this.fired)
          return this.target.removeListener(this.type, this.wrapFn), this.fired = !0, arguments.length === 0 ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
      }
      function _(h, p, v) {
        var E = { fired: !1, wrapFn: void 0, target: h, type: p, listener: v }, O = m.bind(E);
        return O.listener = v, E.wrapFn = O, O;
      }
      function I(h, p, v) {
        var E = h._events;
        if (E === void 0)
          return [];
        var O = E[p];
        return O === void 0 ? [] : typeof O == "function" ? v ? [O.listener || O] : [O] : v ? function(w) {
          for (var T = new Array(w.length), L = 0; L < T.length; ++L)
            T[L] = w[L].listener || w[L];
          return T;
        }(O) : $(O, O.length);
      }
      function b(h) {
        var p = this._events;
        if (p !== void 0) {
          var v = p[h];
          if (typeof v == "function")
            return 1;
          if (v !== void 0)
            return v.length;
        }
        return 0;
      }
      function $(h, p) {
        for (var v = new Array(p), E = 0; E < p; ++E)
          v[E] = h[E];
        return v;
      }
      Object.defineProperty(u, "defaultMaxListeners", { enumerable: !0, get: function() {
        return c;
      }, set: function(h) {
        if (typeof h != "number" || h < 0 || f(h))
          throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + h + ".");
        c = h;
      } }), u.init = function() {
        this._events !== void 0 && this._events !== Object.getPrototypeOf(this)._events || (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
      }, u.prototype.setMaxListeners = function(h) {
        if (typeof h != "number" || h < 0 || f(h))
          throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + h + ".");
        return this._maxListeners = h, this;
      }, u.prototype.getMaxListeners = function() {
        return g(this);
      }, u.prototype.emit = function(h) {
        for (var p = [], v = 1; v < arguments.length; v++)
          p.push(arguments[v]);
        var E = h === "error", O = this._events;
        if (O !== void 0)
          E = E && O.error === void 0;
        else if (!E)
          return !1;
        if (E) {
          var w;
          if (p.length > 0 && (w = p[0]), w instanceof Error)
            throw w;
          var T = new Error("Unhandled error." + (w ? " (" + w.message + ")" : ""));
          throw T.context = w, T;
        }
        var L = O[h];
        if (L === void 0)
          return !1;
        if (typeof L == "function")
          l(L, this, p);
        else {
          var k = L.length, tt = $(L, k);
          for (v = 0; v < k; ++v)
            l(tt[v], this, p);
        }
        return !0;
      }, u.prototype.addListener = function(h, p) {
        return S(this, h, p, !1);
      }, u.prototype.on = u.prototype.addListener, u.prototype.prependListener = function(h, p) {
        return S(this, h, p, !0);
      }, u.prototype.once = function(h, p) {
        return d(p), this.on(h, _(this, h, p)), this;
      }, u.prototype.prependOnceListener = function(h, p) {
        return d(p), this.prependListener(h, _(this, h, p)), this;
      }, u.prototype.removeListener = function(h, p) {
        var v, E, O, w, T;
        if (d(p), (E = this._events) === void 0)
          return this;
        if ((v = E[h]) === void 0)
          return this;
        if (v === p || v.listener === p)
          --this._eventsCount == 0 ? this._events = /* @__PURE__ */ Object.create(null) : (delete E[h], E.removeListener && this.emit("removeListener", h, v.listener || p));
        else if (typeof v != "function") {
          for (O = -1, w = v.length - 1; w >= 0; w--)
            if (v[w] === p || v[w].listener === p) {
              T = v[w].listener, O = w;
              break;
            }
          if (O < 0)
            return this;
          O === 0 ? v.shift() : function(L, k) {
            for (; k + 1 < L.length; k++)
              L[k] = L[k + 1];
            L.pop();
          }(v, O), v.length === 1 && (E[h] = v[0]), E.removeListener !== void 0 && this.emit("removeListener", h, T || p);
        }
        return this;
      }, u.prototype.off = u.prototype.removeListener, u.prototype.removeAllListeners = function(h) {
        var p, v, E;
        if ((v = this._events) === void 0)
          return this;
        if (v.removeListener === void 0)
          return arguments.length === 0 ? (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0) : v[h] !== void 0 && (--this._eventsCount == 0 ? this._events = /* @__PURE__ */ Object.create(null) : delete v[h]), this;
        if (arguments.length === 0) {
          var O, w = Object.keys(v);
          for (E = 0; E < w.length; ++E)
            (O = w[E]) !== "removeListener" && this.removeAllListeners(O);
          return this.removeAllListeners("removeListener"), this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0, this;
        }
        if (typeof (p = v[h]) == "function")
          this.removeListener(h, p);
        else if (p !== void 0)
          for (E = p.length - 1; E >= 0; E--)
            this.removeListener(h, p[E]);
        return this;
      }, u.prototype.listeners = function(h) {
        return I(this, h, !0);
      }, u.prototype.rawListeners = function(h) {
        return I(this, h, !1);
      }, u.listenerCount = function(h, p) {
        return typeof h.listenerCount == "function" ? h.listenerCount(p) : b.call(h, p);
      }, u.prototype.listenerCount = b, u.prototype.eventNames = function() {
        return this._eventsCount > 0 ? s(this._events) : [];
      };
    }, function(e, n) {
      var i = { left: 0, top: 0 };
      e.exports = function(s, a, l) {
        a = a || s.currentTarget || s.srcElement, Array.isArray(l) || (l = [0, 0]);
        var f = s.clientX || 0, u = s.clientY || 0, c = (d = a, d === window || d === document || d === document.body ? i : d.getBoundingClientRect()), d;
        return l[0] = f - c.left, l[1] = u - c.top, l;
      };
    }, function(e, n) {
      e.exports = function(i, s) {
        return { configurable: !0, enumerable: !0, get: i, set: s };
      };
    }, function(e, n) {
      e.exports = function(i, s) {
        var a = s[0] - i[0], l = s[1] - i[1];
        return Math.sqrt(a * a + l * l);
      };
    }, function(e, n, i) {
      var s = i(2), a = i(1).EventEmitter;
      function l(f) {
        var u = (f = f || {}).element || window, c = new a(), d = f.position || [0, 0];
        return f.touchstart !== !1 && (u.addEventListener("mousedown", S, !1), u.addEventListener("touchstart", g, !1)), u.addEventListener("mousemove", S, !1), u.addEventListener("touchmove", g, !1), c.position = d, c.dispose = function() {
          u.removeEventListener("mousemove", S, !1), u.removeEventListener("mousedown", S, !1), u.removeEventListener("touchmove", g, !1), u.removeEventListener("touchstart", g, !1);
        }, c;
        function g(m) {
          S(m.targetTouches[0]);
        }
        function S(m) {
          s(m, u, d), c.emit("move", m);
        }
      }
      e.exports = function(f) {
        return l(f).position;
      }, e.exports.emitter = function(f) {
        return l(f);
      };
    }, function(e, n, i) {
      (function(s) {
        var a = /^\s+|\s+$/g, l = /^[-+]0x[0-9a-f]+$/i, f = /^0b[01]+$/i, u = /^0o[0-7]+$/i, c = parseInt, d = typeof s == "object" && s && s.Object === Object && s, g = typeof self == "object" && self && self.Object === Object && self, S = d || g || Function("return this")(), m = Object.prototype.toString, _ = Math.max, I = Math.min, b = function() {
          return S.Date.now();
        };
        function $(p) {
          var v = typeof p;
          return !!p && (v == "object" || v == "function");
        }
        function h(p) {
          if (typeof p == "number")
            return p;
          if (function(O) {
            return typeof O == "symbol" || function(w) {
              return !!w && typeof w == "object";
            }(O) && m.call(O) == "[object Symbol]";
          }(p))
            return NaN;
          if ($(p)) {
            var v = typeof p.valueOf == "function" ? p.valueOf() : p;
            p = $(v) ? v + "" : v;
          }
          if (typeof p != "string")
            return p === 0 ? p : +p;
          p = p.replace(a, "");
          var E = f.test(p);
          return E || u.test(p) ? c(p.slice(2), E ? 2 : 8) : l.test(p) ? NaN : +p;
        }
        e.exports = function(p, v, E) {
          var O, w, T, L, k, tt, st = 0, x = !1, C = !1, y = !0;
          if (typeof p != "function")
            throw new TypeError("Expected a function");
          function R(G) {
            var X = O, rt = w;
            return O = w = void 0, st = G, L = p.apply(rt, X);
          }
          function M(G) {
            return st = G, k = setTimeout(J, v), x ? R(G) : L;
          }
          function H(G) {
            var X = G - tt;
            return tt === void 0 || X >= v || X < 0 || C && G - st >= T;
          }
          function J() {
            var G = b();
            if (H(G))
              return et(G);
            k = setTimeout(J, function(X) {
              var rt = v - (X - tt);
              return C ? I(rt, T - (X - st)) : rt;
            }(G));
          }
          function et(G) {
            return k = void 0, y && O ? R(G) : (O = w = void 0, L);
          }
          function z() {
            var G = b(), X = H(G);
            if (O = arguments, w = this, tt = G, X) {
              if (k === void 0)
                return M(tt);
              if (C)
                return k = setTimeout(J, v), R(tt);
            }
            return k === void 0 && (k = setTimeout(J, v)), L;
          }
          return v = h(v) || 0, $(E) && (x = !!E.leading, T = (C = "maxWait" in E) ? _(h(E.maxWait) || 0, v) : T, y = "trailing" in E ? !!E.trailing : y), z.cancel = function() {
            k !== void 0 && clearTimeout(k), st = 0, O = tt = w = k = void 0;
          }, z.flush = function() {
            return k === void 0 ? L : et(b());
          }, z;
        };
      }).call(this, i(8));
    }, function(e, n) {
      e.exports = !0;
    }, function(e, n) {
      var i;
      i = function() {
        return this;
      }();
      try {
        i = i || new Function("return this")();
      } catch {
        typeof window == "object" && (i = window);
      }
      e.exports = i;
    }, function(e, n, i) {
      i.r(n);
      var s = i(1), a = i(0), l = i.n(a);
      function f(x) {
        return (f = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(C) {
          return typeof C;
        } : function(C) {
          return C && typeof Symbol == "function" && C.constructor === Symbol && C !== Symbol.prototype ? "symbol" : typeof C;
        })(x);
      }
      function u(x, C) {
        return (u = Object.setPrototypeOf || function(y, R) {
          return y.__proto__ = R, y;
        })(x, C);
      }
      function c(x) {
        var C = function() {
          if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham)
            return !1;
          if (typeof Proxy == "function")
            return !0;
          try {
            return Date.prototype.toString.call(Reflect.construct(Date, [], function() {
            })), !0;
          } catch {
            return !1;
          }
        }();
        return function() {
          var y, R = S(x);
          if (C) {
            var M = S(this).constructor;
            y = Reflect.construct(R, arguments, M);
          } else
            y = R.apply(this, arguments);
          return d(this, y);
        };
      }
      function d(x, C) {
        return !C || f(C) !== "object" && typeof C != "function" ? g(x) : C;
      }
      function g(x) {
        if (x === void 0)
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return x;
      }
      function S(x) {
        return (S = Object.setPrototypeOf ? Object.getPrototypeOf : function(C) {
          return C.__proto__ || Object.getPrototypeOf(C);
        })(x);
      }
      var m = !!l.a && { capture: !1, passive: !0 }, _ = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(x) {
        window.setTimeout(x, 1e3 / 60);
      };
      window.addEventListener("touchmove", function() {
      });
      var I = function(x) {
        (function(R, M) {
          if (typeof M != "function" && M !== null)
            throw new TypeError("Super expression must either be null or a function");
          R.prototype = Object.create(M && M.prototype, { constructor: { value: R, writable: !0, configurable: !0 } }), M && u(R, M);
        })(y, x);
        var C = c(y);
        function y(R) {
          var M, H, J, et, z, G, X, rt, Z, nt, Q, j, bt = R.source, it = bt === void 0 ? document : bt, D = R.update, lt = R.multiplier, It = lt === void 0 ? 1 : lt, xt = R.friction, Kt = xt === void 0 ? 0.92 : xt, U = R.initialValues, F = R.boundX, V = R.boundY, ot = R.bounce, Pt = ot === void 0 || ot;
          (function(A, B) {
            if (!(A instanceof B))
              throw new TypeError("Cannot call a class as a function");
          })(this, y), M = C.call(this);
          var Y = 0, N = 0, Tt = 0.3 * It, Nt = !1, ut = !1, dt = !1, Qt = !1, At = [], Vt = null;
          (function() {
            if (!(it = typeof it == "string" ? document.querySelector(it) : it))
              throw new Error("IMPETUS: source not found.");
            if (!D)
              throw new Error("IMPETUS: update function not defined.");
            U && (U[0] && (Y = U[0]), U[1] && (N = U[1]), We()), F && (H = F[0], J = F[1]), V && (et = V[0], z = V[1]), it.addEventListener("touchstart", ie, m), it.addEventListener("mousedown", ie, m);
          })();
          var qe = M.emit.bind(g(M));
          function ye() {
            document.removeEventListener("touchmove", oe, !!l.a && { passive: !1 }), document.removeEventListener("touchend", me, m), document.removeEventListener("touchcancel", Ye, m), document.removeEventListener("mousemove", oe, !!l.a && { passive: !1 }), document.removeEventListener("mouseup", me, m);
          }
          function We() {
            D.call(it, Y, N, Vt);
          }
          function ze(A) {
            if (A.type === "touchmove" || A.type === "touchstart" || A.type === "touchend") {
              var B = A.targetTouches[0] || A.changedTouches[0];
              return { x: B.clientX, y: B.clientY, id: B.identifier };
            }
            return { x: A.clientX, y: A.clientY, id: null };
          }
          function ie(A) {
            Vt = A;
            var B = ze(A);
            ut || dt || (ut = !0, Qt = !1, nt = B.id, G = rt = B.x, X = Z = B.y, At = [], Ht(G, X), ye(), document.addEventListener("touchmove", oe, !!l.a && { passive: !1 }), document.addEventListener("touchend", me, m), document.addEventListener("touchcancel", Ye, m), document.addEventListener("mousemove", oe, !!l.a && { passive: !1 }), document.addEventListener("mouseup", me, m), qe("start", { x: rt, y: Z, event: Vt }));
          }
          function oe(A) {
            A.preventDefault(), Vt = A;
            var B = ze(A);
            ut && B.id === nt && (rt = B.x, Z = B.y, Ht(G, X), function() {
              Nt || _(Ar), Nt = !0;
            }());
          }
          function me(A) {
            Vt = A;
            var B = ze(A);
            ut && B.id === nt && Ye();
          }
          function Ye() {
            ut = !1, Ht(G, X), function() {
              var A = At[0], B = At[At.length - 1], ft = B.x - A.x, gf = B.y - A.y, is = (B.time - A.time) / 15 / It;
              Q = ft / is || 0, j = gf / is || 0;
              var yf = _e();
              Math.abs(Q) > 1 || Math.abs(j) > 1 || !yf.inBounds ? (Qt = !0, _(ns)) : qe("end", { x: Y, y: N, event: Vt });
            }(), ye();
          }
          function Ht(A, B) {
            for (var ft = Date.now(); At.length > 0 && !(ft - At[0].time <= 100); )
              At.shift();
            At.push({ x: A, y: B, time: ft });
          }
          function Ar() {
            var A = rt - G, B = Z - X;
            if (Y += A * It, N += B * It, Pt) {
              var ft = _e();
              ft.x !== 0 && (Y -= A * Ke(ft.x) * It), ft.y !== 0 && (N -= B * Ke(ft.y) * It);
            } else
              _e(!0);
            We(), G = rt, X = Z, Nt = !1;
          }
          function Ke(A) {
            return 5e-6 * Math.pow(A, 2) + 1e-4 * A + 0.55;
          }
          function _e(A) {
            var B = 0, ft = 0;
            return H !== void 0 && Y < H ? B = H - Y : J !== void 0 && Y > J && (B = J - Y), et !== void 0 && N < et ? ft = et - N : z !== void 0 && N > z && (ft = z - N), A && (B !== 0 && (Y = B > 0 ? H : J), ft !== 0 && (N = ft > 0 ? et : z)), { x: B, y: ft, inBounds: B === 0 && ft === 0 };
          }
          function ns() {
            if (Qt) {
              Y += Q *= Kt, N += j *= Kt;
              var A = _e();
              if (Math.abs(Q) > Tt || Math.abs(j) > Tt || !A.inBounds) {
                if (Pt) {
                  if (A.x !== 0)
                    if (A.x * Q <= 0)
                      Q += 0.04 * A.x;
                    else {
                      var B = A.x > 0 ? 2.5 : -2.5;
                      Q = 0.11 * (A.x + B);
                    }
                  if (A.y !== 0)
                    if (A.y * j <= 0)
                      j += 0.04 * A.y;
                    else {
                      var ft = A.y > 0 ? 2.5 : -2.5;
                      j = 0.11 * (A.y + ft);
                    }
                } else
                  A.x !== 0 && (Y = A.x > 0 ? H : J, Q = 0), A.y !== 0 && (N = A.y > 0 ? et : z, j = 0);
                We(), _(ns);
              } else
                Qt = !1, qe("end", { x: Y, y: N, event: Vt });
            }
          }
          return M.destroy = function() {
            return it.removeEventListener("touchstart", ie), it.removeEventListener("mousedown", ie), ye(), null;
          }, M.pause = function() {
            ye(), ut = !1, dt = !0;
          }, M.resume = function() {
            dt = !1;
          }, M.setValues = function(A, B) {
            typeof A == "number" && (Y = A), typeof B == "number" && (N = B);
          }, M.setMultiplier = function(A) {
            Tt = 0.3 * (It = A);
          }, M.setBoundX = function(A) {
            H = A[0], J = A[1];
          }, M.setBoundY = function(A) {
            et = A[0], z = A[1];
          }, M;
        }
        return y;
      }(s.EventEmitter), b = i(4), $ = i.n(b), h = i(3), p = i.n(h), v = i(2), E = i.n(v), O = !!l.a && { capture: !1, passive: !0 };
      function w() {
        this.position = [0, 0], this.touch = null;
      }
      var T = function(x) {
        x = x || window;
        var C = new s.EventEmitter(), y = [null, null], R = 0, M = 0, H = !1, J = !1;
        return Object.defineProperties(C, { pinching: p()(function() {
          return R === 2;
        }), fingers: p()(function() {
          return y;
        }) }), z(), C.enable = z, C.disable = function() {
          !J || (J = !1, R = 0, y[0] = null, y[1] = null, M = 0, H = !1, x.removeEventListener("touchstart", G, O), x.removeEventListener("touchmove", X, O), x.removeEventListener("touchend", rt, O), x.removeEventListener("touchcancel", rt, O));
        }, C.indexOfTouch = et, C;
        function et(nt) {
          for (var Q = nt.identifier, j = 0; j < y.length; j++)
            if (y[j] && y[j].touch && y[j].touch.identifier === Q)
              return j;
          return -1;
        }
        function z() {
          J || (J = !0, x.addEventListener("touchstart", G, O), x.addEventListener("touchmove", X, O), x.addEventListener("touchend", rt, O), x.addEventListener("touchcancel", rt, O));
        }
        function G(nt) {
          for (var Q = 0; Q < nt.changedTouches.length; Q++) {
            var j = nt.changedTouches[Q];
            if (et(j.identifier) === -1 && R < 2) {
              var bt = R === 0, it = y[0] ? 1 : 0, D = y[0] ? 0 : 1, lt = new w();
              y[it] = lt, R++, lt.touch = j, E()(j, x, lt.position);
              var It = y[D] ? y[D].touch : void 0;
              if (C.emit("place", j, It), !bt) {
                var xt = Z();
                H = !1, C.emit("start", xt, nt), M = xt;
              }
            }
          }
        }
        function X(nt) {
          for (var Q = !1, j = 0; j < nt.changedTouches.length; j++) {
            var bt = nt.changedTouches[j], it = et(bt);
            it !== -1 && (Q = !0, y[it].touch = bt, E()(bt, x, y[it].position));
          }
          if (R === 2 && Q) {
            var D = Z();
            C.emit("change", D, M, nt), M = D;
          }
        }
        function rt(nt) {
          for (var Q = 0; Q < nt.changedTouches.length; Q++) {
            var j = nt.changedTouches[Q], bt = et(j);
            if (bt !== -1) {
              y[bt] = null, R--;
              var it = bt === 0 ? 1 : 0, D = y[it] ? y[it].touch : void 0;
              C.emit("lift", j, D, nt);
            }
          }
          H || R === 2 || (H = !0, C.emit("end", M, nt));
        }
        function Z() {
          return R < 2 ? 0 : $()(y[0].position, y[1].position);
        }
      }, L = i(5), k = i.n(L), tt = i(6), st = i.n(tt);
      n.default = function(x, C, y) {
        function R(U) {
          y.onStart && y.onStart(U);
        }
        function M(U) {
          y.onEnd && requestAnimationFrame(function() {
            y.onEnd(U);
          });
        }
        x instanceof Function && (C = x, x = document.documentElement || document.body), y || (y = {});
        var H = null, J = null, et = null;
        typeof x == "string" && (x = document.querySelector(x));
        var z, G, X = k.a.emitter();
        function rt(U) {
          return U || (U = x.getBoundingClientRect()), { x: X.position[0] - U.x, y: X.position[1] - U.y };
        }
        var Z = { x: 0, y: 0, px: 0, py: 0 }, nt = 0, Q = 0;
        (z = new I({ source: x, update: function(U, F, V) {
          var ot = rt(x.getBoundingClientRect()), Pt = { srcElement: G, event: V, target: x, type: "mouse", dx: U - nt, dy: F - Q, dz: 0, x: ot.x, y: ot.y, x0: Z.x, y0: Z.y, px0: Z.px, py0: Z.py };
          nt = U, Q = F, C(Pt);
        }, multiplier: y.friction || 1, friction: y.multiplier || 0.75, boundX: y.boundX, boundY: y.boundY, bounce: y.bounce })).on("start", function(U) {
          var F = U.event, V = x.getBoundingClientRect(), ot = rt(V);
          Z = { x: ot.x, y: ot.y, px: ot.x / V.width, py: ot.y / V.height }, R({ srcElement: G = F.srcElement, event: F, target: x, type: "mouse", dx: 0, dy: 0, dz: 0, x: ot.x, y: ot.y, x0: Z.x, y0: Z.y, px0: Z.px, py0: Z.py });
        }), z.on("end", function(U) {
          var F = U.event, V = rt();
          M({ srcElement: G, event: F, target: x, type: "mouse", dx: 0, dy: 0, dz: 0, x: V.x, y: V.y, x0: Z.x, y0: Z.y, px0: Z.px, py0: Z.py });
        });
        var j = null;
        function bt() {
          if (j)
            return j;
          var U = function(F) {
            y.passive || F.preventDefault();
            var V = x.getBoundingClientRect(), ot = F.clientX - V.x, Pt = F.clientY - V.y, Y = function(N) {
              N || (N = {});
              var Tt = x.getBoundingClientRect(), Nt = rt(Tt), ut = J || {}, dt = et || {}, Qt = N.x != null ? N.x : Nt.x, At = N.y != null ? N.y : Nt.y, Vt = dt.x != null ? dt.x : Qt, qe = dt.y != null ? dt.y : At, ye = N.dx != null ? N.dx : Qt - Vt, We = N.dy != null ? N.dy : At - qe, ze = N.dz != null ? N.dz : 0, ie = ut.x0 != null ? ut.x0 : N.x0 != null ? N.x0 : Nt.x, oe = ut.y0 != null ? ut.y0 : N.y0 != null ? N.y0 : Nt.y, me = ut.px0 != null ? ut.px0 : ie / Tt.width, Ye = ut.py0 != null ? ut.py0 : oe / Tt.height, Ht = { type: N.type || "mouse", srcElement: N.srcElement || x, target: x, event: N.event, x: Qt, y: At, dx: ye, dy: We, dz: ze, x0: ie, y0: oe, px0: me, py0: Ye }, Ar = !1;
              H || (Ar = !0, J = et = Ht, R(Ht), H = st()(function(_e) {
                M(_e), H = null, J = null, et = null;
              }, 60)), H(Ht);
              var Ke = { isStart: Ar, init: J, last: et, event: Ht };
              return et = Ke.event, Ke;
            }({ dx: 0, dy: 0, dz: 0.5 * F.deltaY, x: ot, y: Pt, x0: ot, y0: Pt, srcElement: F.srcElement, event: F, type: "mouse" });
            C(Y.event);
          };
          return x.addEventListener("wheel", U, { passive: !!y.passive }), U;
        }
        function it() {
          j && (j = x.removeEventListener("wheel", j, { passive: !0 }));
        }
        j = bt();
        var D, lt = T();
        function It() {
          return function(U) {
            var F, V = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : window, ot = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, Pt = ot.threshold || 500, Y = function(N) {
              F ? (F = clearTimeout(F), U && U(N)) : F = setTimeout(function() {
                F = null;
              }, Pt);
            };
            return V.addEventListener("click", Y, { passive: !0 }), function() {
              return V.removeEventListener("click", Y, { passive: !0 }), null;
            };
          }(function() {
            var U, F = x.getBoundingClientRect(), V = rt(F);
            U = { srcElement: x, target: x, type: "mouse", dx: 0, dy: 0, dz: 0, x: V.x, y: V.x, x0: V.x, y0: V.x, px0: V.x / F.width, py0: V.y / F.height }, y.onDoubleTap && y.onDoubleTap(U);
          }, x);
        }
        lt.on("start", function(U, F) {
          var V, ot, Pt = (V = lt.fingers[0], [0.5 * (ot = lt.fingers[1]).position[0] + 0.5 * V.position[0], 0.5 * ot.position[1] + 0.5 * V.position[1]]), Y = x.getBoundingClientRect(), N = Pt[0], Tt = Pt[1];
          (function(Nt, ut, dt) {
            return dt || (dt = x.getBoundingClientRect()), Nt >= dt.x && Nt <= dt.x + dt.width && ut >= dt.y && ut <= dt.y + dt.height;
          })(N, Tt, Y) && (N -= Y.x, Tt -= Y.y, D = { x: N, y: Tt, px0: N / Y.width, py0: Tt / Y.height }, z && z.pause(), R({ srcElement: F.srcElement, event: F, target: x, type: "touch", dx: 0, dy: 0, dz: 0, x: D.x, y: D.y, x0: D.x, y0: D.y, px0: D.px0, py0: D.py0 }));
        }), lt.on("end", function(U, F) {
          D && (z && z.resume(), M({ srcElement: F.srcElement, event: F, target: x, type: "touch", dx: 0, dy: 0, dz: 0, x: D.x, y: D.y, x0: D.x, y0: D.y, px0: D.px0, py0: D.py0 }), D = null);
        }), lt.on("change", function(U, F, V) {
          lt.pinching && D && C({ srcElement: x, event: V, target: x, type: "touch", dx: 0, dy: 0, dz: 1.3 * -(U - F), x: D.x, y: D.x, x0: D.x, y0: D.x, px0: D.px0, py0: D.py0 });
        });
        var xt = It(), Kt = function() {
          X.dispose(), z.destroy(), it(), xt && (xt = xt()), lt.disable();
        };
        return Kt.disablePan = function() {
          z && z.pause();
        }, Kt.enablePan = function() {
          z && z.resume();
        }, Kt.disableZoom = function() {
          lt && lt.disable(), it(), xt && (xt = xt());
        }, Kt.enableZoom = function() {
          lt && lt.enable(), j = bt(), xt = It();
        }, Kt;
      };
    }]);
  });
})(vf);
const Kw = /* @__PURE__ */ Uc(vf.exports), Qw = /* @__PURE__ */ nl({
  __name: "PanZoom",
  emits: ["zoom", "drag", "start", "end"],
  setup(r, { emit: t }) {
    const e = bi(!1);
    let n = null;
    const i = bi();
    return xf(() => {
      navigator.userAgent.includes("jsdom") || (n = Kw(i.value, (s) => {
        if (s.dz !== 0) {
          t("zoom", Math.exp(-s.dz / 256), new o.Point(s.x, s.y));
          return;
        }
        t("drag", new o.Vector(-s.dx, -s.dy));
      }, {
        onStart() {
          t("start");
        },
        onEnd() {
          t("end");
        }
      }));
    }), Sf(() => {
      n();
    }), (s, a) => (il(), Ef("div", {
      class: $f(["pan-zoom", { pan: e.value }]),
      ref_key: "container",
      ref: i,
      onMousedown: a[0] || (a[0] = (l) => e.value = !0),
      onMouseup: a[1] || (a[1] = (l) => e.value = !1),
      onMouseout: a[2] || (a[2] = (l) => e.value = !1)
    }, [
      ol(s.$slots, "default", {}, void 0, !0)
    ], 34));
  }
});
const Hw = (r, t) => {
  const e = r.__vccOpts || r;
  for (const [n, i] of t)
    e[n] = i;
  return e;
}, Xw = /* @__PURE__ */ Hw(Qw, [["__scopeId", "data-v-153adf05"]]), ex = /* @__PURE__ */ nl({
  __name: "PanZoomViewport",
  setup(r) {
    const t = bi(new Yw());
    function e(i, s) {
      t.value.zoom(i, s);
    }
    function n(i) {
      t.value.drag(i);
    }
    return (i, s) => (il(), Of(Xw, {
      onZoom: e,
      onDrag: n
    }, {
      default: If(() => [
        ol(i.$slots, "default", { viewport: t.value })
      ]),
      _: 3
    }));
  }
});
export {
  St as CartesianCoordinateSystem,
  Xw as PanZoom,
  ex as PanZoomViewport,
  Yw as Viewport
};
