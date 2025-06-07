// bubble.js
window.bubbleChart = (function () {
  let svg, tooltip;

  function init(svgElement, tooltipElement) {
    svg = svgElement;
    tooltip = tooltipElement;

    const width = 900;
    const height = 600;

    d3.dsv(";", "data.csv", d3.autoType).then(data => {
      const top = data.sort((a, b) => b["U.S. Systemwide Sales (Millions - U.S Dollars)"] - a["U.S. Systemwide Sales (Millions - U.S Dollars)"]).slice(0, 20);

      const pack = d3.pack().size([width, height]).padding(10);
      const root = d3.hierarchy({ children: top }).sum(d => d["U.S. Systemwide Sales (Millions - U.S Dollars)"]);
      const nodes = pack(root).leaves();
      const color = d3.scaleOrdinal(d3.schemeSet2);

      const node = svg.selectAll("g")
        .data(nodes)
        .enter().append("g")
        .attr("transform", d => `translate(${d.x},${d.y})`);

      node.append("circle")
        .attr("r", d => d.r)
        .attr("fill", d => color(d.data["Fast-Food Chains"]))
        .on("mouseover", (event, d) => {
          tooltip.style("opacity", 1)
            .html(`<strong>${d.data["Fast-Food Chains"]}</strong><br>Ventas: $${d.data["U.S. Systemwide Sales (Millions - U.S Dollars)"]}M`)
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 28}px`);
        })
        .on("mouseout", () => tooltip.style("opacity", 0));

      node.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", ".3em")
        .attr("fill", "white")
        .style("font-size", d => d.r / 4)
        .text(d => d.data["Fast-Food Chains"].split(" ")[0]);
    });
  }

  function destroy() {
    svg.selectAll("*").remove();
    tooltip.style("opacity", 0);
  }

  return { init, destroy };
})();
