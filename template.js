const listItemsTemplate = `
	<% for (let i = page*pageSize, y=0;y< pageSize && filteredCards[i]; i++,y++){%>
		<div class="listedCard row" draggable="false" onclick="addToFL(<%filteredCards[i].id%>)">
			<div class="col-4 listedCardPicContainer">
				<img draggable="false" cardId="<%filteredCards[i].id%>" class="listedCardPic" src="https://www.duelingbook.com/images/low-res/<%filteredCards[i].id%>.jpg"/>
			</div>
			<div class="col-8">
				<div class="listedCardInfo row">
					<% filteredCards[i].n %>
				</div>
				<div class="listedCardInfo row">
					Info row 2
				</div>
				<div class="listedCardInfo row">
					Info row 3
				</div>
			</div>
		</div>
	<% } %>
`

const flListItemsTemplate = `
	<% for (let c of this.cardsInList){%>
		<img draggable="false" class="flCard" src="https://www.duelingbook.com/images/low-res/<%c.id%>.jpg" onclick="removeFromFL(<%c.id%>,<%this.list%>)"/>
	<% } %>
`