<script src="https://d3js.org/d3.v6.min.js"></script>
        // Sample data
        const treeData = {
            "name": "Root",
            "children": [
                { "name": "Node 1" },
                {
                    "name": "Node 2",
                    "children": [
                        { "name": "Node 2.1" },
                        { "name": "Node 2.2" }
                    ]
                },
                { "name": "Node 3" }
            ]
        };

        // Set up the tree layout
        const treeLayout = d3.tree().size([500, 300]);
        const rootNode = d3.hierarchy(treeData);
        treeLayout(rootNode);

        // Create SVG container
        const svg = d3.select("#tree-container")
            .append("svg")
            .attr("width", 600)
            .attr("height", 400)
            .append("g")
            .attr("transform", "translate(50,50)");

        // Update the tree
        const updateTree = () => {
            const nodes = rootNode.descendants();
            const links = rootNode.links();

            // Update nodes
            const node = svg.selectAll(".node")
                .data(nodes, d => d.data.name);

            const nodeEnter = node.enter().append("g")
                .attr("class", "node")
                .attr("transform", d => 'translate(${d.y},${d.x})')
                .on("click", (event, d) => {
                    toggleChildren(d);
                    updateTree();
                });

            nodeEnter.append("circle")
                .attr("r", 8);

            nodeEnter.append("text")
                .attr("dy", "0.31em")
                .attr("x", d => d.children ? -12 : 12)
                .attr("text-anchor", d => d.children ? "end" : "start")
                .text(d => d.data.name);

            // Update links
            const link = svg.selectAll(".link")
                .data(links, d => d.target.data.name);

            link.enter().insert("path", "g")
                .attr("class", "link")
                .attr("d", d3.linkHorizontal()
                    .x(d => d.y)
                    .y(d => d.x));

            // Remove any existing nodes and links
            node.exit().remove();
            link.exit().remove();
        };

        // Function to toggle children on click
        const toggleChildren = (node) => {
            if (node.children) {
                node._children = node.children;
                node.children = null;
            } else {
                node.children = node._children;
                node._children = null;
            }
        };

        // Initial tree rendering
        updateTree();
    