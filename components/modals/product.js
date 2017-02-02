export default () => {
  return (
    <div className="modal modal--product" id="samples">
      <div className="modal__dialog">
        <div className="modal__inner">
          <div className="modal__header clearfix">
            <button type="button" className="modal__close" data-dismiss="modal" aria-label="Close"><span
              aria-hidden="true">×</span></button>
          </div>
          <div className="modal__body">
            <tabset>
              <tab heading="В раме">
                <div className="row">
                  <div className="col-xs-12 col-sm-4">
                    <img className="modal__body__row__img" src="/static/img/products/samples/frame-1.jpg"/>
                    <p>Мы используем лучшую краску и бумагу, чтобы быть увереными в том, что картина вам понравится.</p>
                  </div>
                  <div className="col-xs-12 col-sm-4">
                    <img className="modal__body__row__img" src="/static/img/products/samples/frame-2.jpg"/>
                    <p>Профессиональная рамка черного или белого цвета из чистого дерева. По желанию дополняется
                      матовыми краями.</p>
                  </div>
                  <div className="col-xs-12 col-sm-4">
                    <img className="modal__body__row__img" src="/static/img/products/samples/frame-3.jpg"/>
                    <p>Металлические крепления и стальная леска обеспечивают надежную фиксацию и удобную регулировку
                      картины.</p>
                  </div>
                </div>
              </tab>
              <tab heading="На холсте">
                <div className="row">
                  <div className="col-xs-12 col-sm-4">
                    <img className="modal__body__row__img" src="/static/img/products/samples/canvas-1.jpg"/>
                    <p>Мы используем только профессиональные хлопко-полиэстровые холсты, идеально подходящие для
                      передачи как цветных так и черно-белых изображений.</p>
                  </div>
                  <div className="col-xs-12 col-sm-4">
                    <img className="modal__body__row__img" src="/static/img/products/samples/canvas-2.jpg"/>
                    <p>Ручная сборка и натяжка на подрамники глубиной 1.5см и 3см по выбору.</p>
                  </div>
                  <div className="col-xs-12 col-sm-4">
                    <img className="modal__body__row__img" src="/static/img/products/samples/canvas-3.jpg"/>
                    <p>Металлические крепления и стальная леска обеспечивают надежную фиксацию и удобную регулировку
                      картины.</p>
                  </div>
                </div>
              </tab>
              <tab heading="Печать">
                <div className="row">
                  <div className="col-xs-12 col-sm-6">
                    <img className="modal__body__row__img" src="/static/img/products/samples/print-1.jpg"/>
                    <p>Используем матовую бумагу премиум качества плотностью 345 г/см.</p>
                  </div>
                  <div className="col-xs-12 col-sm-6">
                    <img className="modal__body__row__img" src="/static/img/products/samples/print-2.jpg"/>
                    <p>Сразу можно повесить на стену или вставить в раму.</p>
                  </div>
                </div>
              </tab>
            </tabset>
          </div>
          <div className="modal__footer m-text_left">
            <ul>
              <li>Примерьте на стене в течении 30 дней. Не понравится — вернем деньги.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}