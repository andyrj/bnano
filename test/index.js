import test from "ava";
import { JSDOM } from "jsdom";
import { html } from "../src";

test.beforeEach(t => {
  const dom = new JSDOM("<!DOCTYPE html><head></head><body></body></html>");
  t.dom = dom;
  global.window = dom.window;
  global.document = dom.window.document;
});

test("tagged template literal should handle static templates", t => {
  const template = html`<div id="test">test</div>`;
  t.is(template.fragment.content.firstChild.id, "test");
  t.is(template.fragment.content.firstChild.firstChild.nodeValue, "test");
});

test("tagged template literal should handle dynamic template with string child", t => {
  const str = "test";
  const template = html`<div id="test">${str}</div>`;
  t.is(template.fragment.content.firstChild.id, "test");
  t.is(template.fragment.content.firstChild.firstChild.nodeValue, str);
});

test("tagged template literal should handle nested template", t => {
  const nested = html`<div id="test">test</div>`;
  const template = html`<div>${nested}</div>`;
  t.is(template.fragment.content.firstChild.firstChild.id, "test");
  t.is(template.fragment.content.firstChild.firstChild.firstChild.nodeValue, "test");
});

test("tagged template literal should handle dom nodes", t => {
  const node = document.createElement("div");
  node.id = "test";
  const template = html`<div>${node}</div>`;
  t.is(template.fragment.content.firstChild.firstChild.id, "test");
});

test("tagged template literal should handle dynamic nodes dispersed in static nodes", t => {
  const str = "dynamic";
  const template = html`<div>This is static, this is ${str}</div>`;
  t.is(template.fragment.content.firstChild.innerHTML, "This is static, this is dynamic");

  const template1 = html`<div>${str} is at start`;
  t.is(template1.fragment.content.firstChild.innerHTML, "dynamic is at start");

  const template2 = html`<div>in the middle it's ${str}!`;
  t.is(template2.fragment.content.firstChild.innerHTML, "in the middle it's dynamic!");
})

test("tagged template literal should handle dynamic attributes", t => {
  const str = "test";
  const template = html`<div id=${str}>test</div>`;
  t.is(template.fragment.content.firstChild.id, str);
});

test("tagged template literal should handle dynamic child interspersed with static nodes", t => {
  const node = document.createElement("div");
  node.innerHTML = "test";
  const template = html`<div><br>before${node}<br>after</div>`;
  t.is(template.fragment.content.firstChild.outerHTML, "<div><br>before<div>test</div><br>after</div>");
});
