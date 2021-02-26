M.AutoInit();
// Login Swap Div
$('#logSwapBtn').on('click', () => {
    $('.loginContainDiv').addClass('hide');
    $('.regContainDiv').removeClass('hide');
});
// Registry Swap Div
$('#regSwapBtn').on('click', () => {
    $('.loginContainDiv').removeClass('hide');
    $('.regContainDiv').addClass('hide');
});

$('.dropdown-trigger').dropdown({
    coverTrigger: false
});


