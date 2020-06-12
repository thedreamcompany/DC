class CommentBox extends React.Component {
  _postComments() {
    // Code pen doesn't allow access. 
  }

  _fetchComments() {
    jQuery.ajax({
      method: 'GET',
      url: 'https://thedreamcompany.github.io/Comment/comment.js',
      success: a => {
        var data = JSON.parse(a);
        this.setState({ comments: data });
      },
      error: function () {
        console.log('ajax get error');
      } });

  }

  constructor() {
    super();
    this.state = {
      showComments: false,
      comments: [] };

  }

  componentWillMount() {
    this._fetchComments();
    clearInterval(this._timer);
  }

  componentDidMount() {
    this._timer = setInterval(() => this._fetchComments(), 5000);
    clearInterval(this._timer);
  }

  _getComments() {
    return this.state.comments.map(comment => {
      return (
        React.createElement(Comment, { author: comment.author, body: comment.body, key: comment.id, delete: this._handleDelete.bind(this) }));

    }).reverse();
  }

  _getAvatars() {
    return this.state.comments.map(comment => {
      return (
        comment.author);

    });
  }

  _getCommentsTitle(commentCount) {
    if (commentCount === 0) {
      return 'No comments yet - ';
    } else if (commentCount === 1) {
      return '1 comment - ';
    } else {
      return commentCount + ' Comments';
    }
  }

  _getCommentsPopularity(commentCount) {
    if (commentCount === 0) {
      return React.createElement(Label, { type: "danger", label: "No Comments Yet!" });
    } else if (commentCount <= 10) {
      return React.createElement(Label, { type: "warning", label: "" });
    } else {
      return React.createElement(Label, { type: "success", label: "Couldn't Load All Comments!" });
    }
  }

  _handleClick() {
    this.setState({
      showComments: !this.state.showComments });

  }

  _addComment(author, body) {
    const comment = {
      id: this.state.comments.length + 1,
      author,
      body };

    this.setState({
      showComments: true,
      comments: this.state.comments.concat([comment]) });

  }

  _handleDelete(event) {
    event.preventDefault();
    console.log('delete');
    this.props.onDelete(this.props.comment);
  }

  render() {
    const comments = this._getComments() || [];
    const author = this._getAvatars() || [];
    let commentNodes;
    let commentBtn;
    let buttonText = "show comments";

    if (this.state.showComments) {
      commentNodes = React.createElement("div", { className: "comment-list" }, " ", comments, " ");
      buttonText = "hide comments";
    }
    if (comments.length > 0) {
      commentBtn = React.createElement(Button, { class: "link", label: buttonText, clickThis: this._handleClick.bind(this) });

    } else {
      commentBtn = React.createElement(Button, { class: "disabled", disabled: "true", icon: "fa-comment-o" });
    }
    return (
      React.createElement("div", { className: "comment-box" },
      React.createElement("div", null, author),
      React.createElement("h3", null,
      this._getCommentsTitle(comments.length),
      this._getCommentsPopularity(comments.length)),


      React.createElement(CommentForm, { addComment: this._addComment.bind(this) }),

      React.createElement("div", { className: "row" },
      React.createElement("div", { className: "col-md-12" },
      React.createElement("div", { className: "margin-md-bottom pull-right" },
      commentBtn))),




      commentNodes));



  }}
;

class Button extends React.Component {
  render() {
    let contents;
    if (this.props.icon) {
      contents = React.createElement("i", { className: 'fa ' + this.props.icon, "aria-hidden": "true" });
    } else {
      contents = this.props.label;
    }
    return (
      React.createElement("button", {
        className: 'btn btn-sm btn-' + this.props.class,
        disabled: this.props.disabled ? 'disabled' : null,
        onClick: this.props.clickThis },
      contents));


  }}
;

class Label extends React.Component {
  render() {
    return (
      React.createElement("span", { className: "label label-" + this.props.type }, this.props.label));

  }}
;

class Comment extends React.Component {
  render() {
    return (
      React.createElement("div", { className: "comment" },
      React.createElement("p", { className: "comment-header" }, this.props.author),
      React.createElement("p", { className: "comment-body" }, this.props.body),
      React.createElement("div", { className: "comment-footer" },
      React.createElement("a", { href: "#", className: "comment-footer-delete", onClick: this.props.delete }, ""))));





  }}
;

class CommentForm extends React.Component {
  render() {
    return (
      React.createElement("form", { className: "comment-form", onSubmit: this._handleSubmit.bind(this) },
      React.createElement("div", { className: "form-group" },
      React.createElement("input", { className: "form-control", placeholder: "name:", ref: input => this._author = input })),

      React.createElement("div", { className: "form-group" },
      React.createElement("textarea", { className: "form-control", placeholder: "Comment:", ref: textarea => this._body = textarea })),

      React.createElement("div", { className: "form-group" },
      React.createElement("button", { className: "btn", type: "submit" }, "Submit"))));



  }
  _handleSubmit(event) {
    event.preventDefault();

    let author = this._author;
    let body = this._body;
    if (author.value && body.value) {
      this.props.addComment(author.value, body.value);
      author.value = '';
      body.value = '';
    } else {
      alert('Please fill out the form');
    }
  }}
;

ReactDOM.render(
React.createElement(CommentBox, null),
document.getElementById('comment-box'));