import React from 'react';

interface Props {
  orgLine1: string;
  orgLine2?: string;
  title: string;
  note?: string;
  signLabel: string;
  children: React.ReactNode;
}

export const SheetWrapper: React.FC<Props> = ({
  orgLine1,
  orgLine2,
  title,
  note,
  signLabel,
  children,
}) => (
  <div className="rp-sheet">
    <div className="rp-sheet-header">
      <div className="rp-sheet-header__org-block">
        <div className="rp-sheet-header__org-line">{orgLine1}</div>
        {orgLine2 && (
          <div className="rp-sheet-header__org-line rp-sheet-header__org-line--bold">
            {orgLine2}
          </div>
        )}
      </div>
      <div className="rp-sheet-header__title">{title}</div>
    </div>

    {note && <div className="rp-sheet-note">{note}</div>}

    {children}

    <div className="rp-sheet-footer">
      <div />
      <div className="rp-sheet-footer__sign-block">
        <div className="rp-sheet-footer__date">
          Hà Nội, ngày &nbsp;&nbsp; tháng &nbsp;&nbsp; năm 2026
        </div>
        <div className="rp-sheet-footer__sign">{signLabel}</div>
      </div>
    </div>
  </div>
);
