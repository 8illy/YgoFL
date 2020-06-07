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
					Tcg Status - <%liststatus[filteredCards[i].tcgl].name%>
				</div>
				<div class="listedCardInfo row">
					Ocg Status - <%liststatus[filteredCards[i].ocgl].name%>
				</div>
			</div>
		</div>
	<% } %>
`

const flListItemsTemplate = `
	<% for (let c of this.cardsInList){%>
		<div class="col-2">
			<img draggable="false" class="flCard" src="https://www.duelingbook.com/images/low-res/<%c%>.jpg" onclick="removeFromFL(<%c%>,<%this.list%>)"/>
		</div>
	<% } %>
`

const limitOptionsTemplate = `
	<% for (let i in liststatus){%>
		<input type="radio" id="sel<%liststatus[i].name%>" name="list" value="<%i%>">
		<label for="sel<%liststatus[i].name%>"><%liststatus[i].name%></label>
	<% } %>
`


const limitOptionsRowTemplate = `
	<% for (let e of liststatus){%>
		<div class="flRow row">
			<div class="col-2 flRowImgContainer">
				<img class="flRowImg" src="<%e.image%>"/>
			</div>
			<div class="col-10 flRowContentContainer row">
				
			</div>
		</div>
	<% } %>
`