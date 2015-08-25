(function(ctx) {
  var $ = ctx.$;

  function handleEv(ev) {
    if (ev && ev.preventDefault)
      ev.preventDefault();

    return false;
  }

  // Métodos para chamar o nosso backend
  ctx.client = {
    invite: function(ev) {
      $('.alert').hide();
      $('button[type=submit]').attr('disabled', 'disabled');
      $.post('/api/v1/invite', {
        email: $('input[type=email]').val()
      })
        .done(function() {
          $('.alert-success').show();
        })
        .fail(function() {
          $('.alert-danger').show();
        })
        .always(function() {
          $('button[type=submit]').removeAttr('disabled');
        });

      return handleEv(ev);
    }
  };
}).call(null, this);
