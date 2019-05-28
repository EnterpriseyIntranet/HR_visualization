
export function generateMembers(N, countries, divisions){//{{{
	//member: [id, name, username, position, specialization]
	var numCountries = countries.length;
	var numDivisions = divisions.length;
	var members = [];
	for(var i=0;i<N;i++){
		var index_country = Math.floor(Math.random()*numCountries);
		var index_division = Math.floor(Math.random()*numDivisions);
		var member = {
			id: i,
			name: "Member " + String(i),
			username: "username" + String(i) + "@cspii.org",
			countries: [countries[index_country]],
			divisions: [divisions[index_division]],
			position: "position " + String(i),
			specialization: "specialization " + String(i)
		};
		members.push(member);
	}
	return members;
}//}}}
export function createGraph(countries, divisions, members, options){ //{{{
    var g = {
      nodes: [],
      edges: []
    };
	g.nodes = getCountryDivNodes(countries, divisions, options);
	g = addMembersToCDNodes(g, countries, divisions, members, options);
	g.nodes.forEach(function(n) {
		n.isOpen = false;
		if(n.type == "CountryDiv"){
			n.isOpen = true;
		}
	});
	return g;
} //}}}
export function getMembersForCountryDivision(members, country, division){//{{{
	var retval = [];
	for(let m of members){
		if(m.countries.indexOf(country)>-1 && m.divisions.indexOf(division)>-1){
			retval.push(m);
		}
	}
	return retval;
}//}}}
export function getMemberHTML(member){ //{{{
	  var html = "<div>";
	html += '<h2 class="underline">' + member.name + '</h2>';
	html += "<ul>"
	for(let key of Object.keys(member)){
		if(key=="name") continue;
		html += '<li>';
		html += key + ': ' + member[key];
		html += '</li>';
	}
	html += '</ul>';
	html += '</div>';
	return html;
} //}}}
export function updatePane(sigma){ //{{{
	var btn = document.getElementById('collapse-btn');
	btn.onclick = function(){
		collapseAll(sigma);
	};
} //}}}
export function collapseAll(sigma){ //{{{
	console.log("collapsing all");
	sigma.graph.collapseAll();
	sigma.graph.updateNodePositions();
	sigma.refresh();
} //}}}

function getCountryDivNodes(countries, divisions, options){//{{{
	var nodes = [];
	var numCountries = countries.length;
	var numDivisions = divisions.length;
	var i,k;

	var xNroot = 0, yNroot = 0;
	nodes.push({
		id: 'root',
		label: 'RootNode CSPII',
		x: xNroot,
		y: yNroot,
		size: options.nodeSizes[0],
		color: options.nodeColors[0],
		 type: 'root',
		hidden: true
	});

	/*
	//TODO: add repositioning capability
	//Add Country Nodes
	for(i=0;i<numCountries;i++){
		nodes.push({
			id: 'node_' + countries[i],
			label: countries[i],
			x: xNroot + (0)*options.dxCD,
			y: yNroot + (i+1)*options.dyCD,
			size: options.nodeSizes[1],
			color: '#000',//options.nodeColors[0]
			type: 'Country',
			country: countries[i]
		});
	}
	
	//Add Division Nodes
	for(k=0;k<numDivisions;k++){
		nodes.push({
			id: 'node_' + divisions[k],
			label: divisions[k],
			x: xNroot + (k+1)*options.dxCD,
			y: yNroot + (0)*options.dyCD,
			size: options.nodeSizes[1],
			color: '#000',//options.nodeColors[0]
			type: 'Division',
			division: divisions[k]
		});
	}
	*/
	
	//Add CountryDiv Nodes
	for(i=0;i<numCountries;i++){
		for(k=0;k<numDivisions;k++){
			nodes.push({
				id: 'node_' + countries[i] + '_' + divisions[k],
				label: countries[i] + ' / ' + divisions[k],
				x: xNroot + (k+1)*options.dxCD,
				y: yNroot + (i+1)*options.dyCD,
				size: options.nodeSizes[1],
				color: '#000',//options.nodeColors[0]
				type: 'CountryDiv',
				country: countries[i],
				division: divisions[k]
			});
		}
	}
	
	return nodes;
}//}}}
function addMembersToCDNodes(graph, countries, divisions, members, options){//{{{
	var g = graph;
	var memCount = 0;
	var dx = 0.25, dy = 0.25;
	for(let node of g.nodes){
		var memsCD = getMembersForCDNode(node, members);
		//console.log(memsCD);
		if(memsCD){
			var numMemsCD = memsCD.length;
			var memCountNode = 0;
			for(let m of memsCD){
				// node
				var newNode = {
					id: 'nM_' + String(memCount),
					label: m.name,
					x: node.x + options.dxM,
					y: node.y + (memCountNode + 1)*options.dyM,
					size: options.nodeSizes[1],
					color: options.nodeColors[1],
					type: 'Member',
					member: m
				};
				g.nodes.push(newNode);
				memCount++;
				memCountNode++;

				//edge
				g.edges.push({
					id: 'eCM' + g.edges.length, //XXX
					source: node.id,
					target: newNode.id,
					size: 1,
					color: '#ccc'
				});
			}
		} else {
			continue;
		}
	}
	return g;
}//}}}

function getMembersForCDNode(node, members){//{{{
	if(node.type === 'CountryDiv'){
		var ms = [];
		for(let m of members){
			if(m.countries.indexOf(node.country) > -1 && m.divisions.indexOf(node.division) > -1){
				ms.push(m);
			}
		}
		return ms;
	} else {
		return null;
	}
}//}}}

// export function structureMembers(members, countries, divisions){//{{{
// 	//for each country, have list of divisions
// 	var data = [];
// 	for(let i=0; i<countries.length; i++){
// 		var countryData = {};
// 		for(let k=0; k<divisions.length; k++){
// 			var memCD = [];
// 			for(let m of members){
// 				if(m.countries.indexOf(countries[i])>-1 && m.divisions.indexOf(divisions[k])>-1)
// 					memCD.push(m);
// 			}
// 			countryData[divisions[k]] = memCD;
// 		}
// 		data[countries[i]]=countryData;
// 	}
// 	return data;
// }//}}}
// export function getDivisionMatrix(countries, divisions){//{{{
// 	var numCountries = countries.length;
// 	var numDivisions = divisions.length;
// 	var matrix = [];
// 	var i,k;
// 	for(i=0;i<numCountries;i++){
// 		for(k=0;k<numDivisions;k++){
// 			matrix[i][k] = {id:i*numDivisions + k,
// 				country: countries[i],
// 				division: divisions[k]
// 			}
// 		}
// 	}
// 	return matrix;
// }//}}}


