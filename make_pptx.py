import os
import zipfile
from datetime import datetime, timezone
from xml.sax.saxutils import escape


EMU_PER_INCH = 914400
SLIDE_CX = 10 * EMU_PER_INCH
SLIDE_CY = int(7.5 * EMU_PER_INCH)


def _xml_decl():
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'


def _rels_xml(rels):
    items = []
    for rid, rtype, target in rels:
        items.append(
            f'<Relationship Id="{escape(rid)}" '
            f'Type="{escape(rtype)}" Target="{escape(target)}"/>'
        )
    return (
        _xml_decl()
        + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        + "".join(items)
        + "</Relationships>"
    )


def _content_types_xml(slide_count: int):
    overrides = [
        ('/ppt/presentation.xml', 'application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml'),
        ('/ppt/slideMasters/slideMaster1.xml', 'application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml'),
        ('/ppt/slideLayouts/slideLayout1.xml', 'application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml'),
        ('/ppt/theme/theme1.xml', 'application/vnd.openxmlformats-officedocument.theme+xml'),
        ('/docProps/core.xml', 'application/vnd.openxmlformats-package.core-properties+xml'),
        ('/docProps/app.xml', 'application/vnd.openxmlformats-officedocument.extended-properties+xml'),
    ]
    for i in range(1, slide_count + 1):
        overrides.append((f'/ppt/slides/slide{i}.xml', 'application/vnd.openxmlformats-officedocument.presentationml.slide+xml'))

    parts = [
        _xml_decl(),
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">',
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>',
        '<Default Extension="xml" ContentType="application/xml"/>',
    ]
    for part_name, ctype in overrides:
        parts.append(f'<Override PartName="{escape(part_name)}" ContentType="{escape(ctype)}"/>')
    parts.append("</Types>")
    return "".join(parts)


def _presentation_xml(slide_count: int):
    sld_ids = []
    # Slide IDs must be unique uint32 and typically start from 256
    for i in range(1, slide_count + 1):
        sld_ids.append(f'<p:sldId id="{255 + i}" r:id="rId{1 + i}"/>')

    return (
        _xml_decl()
        + '<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" '
        + 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" '
        + 'xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">'
        + '<p:sldMasterIdLst>'
        + '<p:sldMasterId id="2147483648" r:id="rId1"/>'
        + "</p:sldMasterIdLst>"
        + "<p:sldIdLst>"
        + "".join(sld_ids)
        + "</p:sldIdLst>"
        + f'<p:sldSz cx="{SLIDE_CX}" cy="{SLIDE_CY}" type="screen4x3"/>'
        + f'<p:notesSz cx="{int(10 * EMU_PER_INCH)}" cy="{int(7.5 * EMU_PER_INCH)}"/>'
        + "</p:presentation>"
    )


def _presentation_rels_xml(slide_count: int):
    rels = [
        (
            "rId1",
            "http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster",
            "slideMasters/slideMaster1.xml",
        )
    ]
    for i in range(1, slide_count + 1):
        rels.append(
            (
                f"rId{1 + i}",
                "http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide",
                f"slides/slide{i}.xml",
            )
        )
    return _rels_xml(rels)


def _slide_master_xml():
    return (
        _xml_decl()
        + '<p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" '
        + 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" '
        + 'xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">'
        + '<p:cSld name="Master">'
        + '<p:spTree>'
        + '<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>'
        + '<p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/>'
        + '<a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>'
        + "</p:spTree>"
        + "</p:cSld>"
        + '<p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" '
        + 'accent1="accent1" accent2="accent2" accent3="accent3" '
        + 'accent4="accent4" accent5="accent5" accent6="accent6" '
        + 'hlink="hlink" folHlink="folHlink"/>'
        + '<p:sldLayoutIdLst><p:sldLayoutId id="1" r:id="rId1"/></p:sldLayoutIdLst>'
        + "<p:txStyles>"
        + "<p:titleStyle/><p:bodyStyle/><p:otherStyle/>"
        + "</p:txStyles>"
        + "</p:sldMaster>"
    )


def _slide_master_rels_xml():
    return _rels_xml(
        [
            (
                "rId1",
                "http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout",
                "../slideLayouts/slideLayout1.xml",
            ),
            (
                "rId2",
                "http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme",
                "../theme/theme1.xml",
            ),
        ]
    )


def _slide_layout_xml():
    return (
        _xml_decl()
        + '<p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" '
        + 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" '
        + 'xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" '
        + 'type="blank" preserve="1">'
        + '<p:cSld name="Blank">'
        + '<p:spTree>'
        + '<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>'
        + '<p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/>'
        + '<a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>'
        + "</p:spTree>"
        + "</p:cSld>"
        + '<p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>'
        + "</p:sldLayout>"
    )


def _slide_layout_rels_xml():
    return _rels_xml(
        [
            (
                "rId1",
                "http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster",
                "../slideMasters/slideMaster1.xml",
            )
        ]
    )


def _theme_xml():
    return (
        _xml_decl()
        + '<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="StudyMate Theme">'
        + "<a:themeElements>"
        + '<a:clrScheme name="Office">'
        + '<a:dk1><a:srgbClr val="1F2937"/></a:dk1>'
        + '<a:lt1><a:srgbClr val="FFFFFF"/></a:lt1>'
        + '<a:dk2><a:srgbClr val="111827"/></a:dk2>'
        + '<a:lt2><a:srgbClr val="F9FAFB"/></a:lt2>'
        + '<a:accent1><a:srgbClr val="2563EB"/></a:accent1>'
        + '<a:accent2><a:srgbClr val="10B981"/></a:accent2>'
        + '<a:accent3><a:srgbClr val="F59E0B"/></a:accent3>'
        + '<a:accent4><a:srgbClr val="EF4444"/></a:accent4>'
        + '<a:accent5><a:srgbClr val="8B5CF6"/></a:accent5>'
        + '<a:accent6><a:srgbClr val="06B6D4"/></a:accent6>'
        + '<a:hlink><a:srgbClr val="2563EB"/></a:hlink>'
        + '<a:folHlink><a:srgbClr val="1D4ED8"/></a:folHlink>'
        + "</a:clrScheme>"
        + '<a:fontScheme name="Office">'
        + '<a:majorFont><a:latin typeface="Calibri"/></a:majorFont>'
        + '<a:minorFont><a:latin typeface="Calibri"/></a:minorFont>'
        + "</a:fontScheme>"
        + '<a:fmtScheme name="Office"><a:fillStyleLst/><a:lnStyleLst/><a:effectStyleLst/><a:bgFillStyleLst/></a:fmtScheme>'
        + "</a:themeElements>"
        + "</a:theme>"
    )


def _docprops_core_xml(title: str):
    now = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    return (
        _xml_decl()
        + '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" '
        + 'xmlns:dc="http://purl.org/dc/elements/1.1/" '
        + 'xmlns:dcterms="http://purl.org/dc/terms/" '
        + 'xmlns:dcmitype="http://purl.org/dc/dcmitype/" '
        + 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'
        + f"<dc:title>{escape(title)}</dc:title>"
        + "<dc:creator>Codex</dc:creator>"
        + '<cp:lastModifiedBy>Codex</cp:lastModifiedBy>'
        + f'<dcterms:created xsi:type="dcterms:W3CDTF">{escape(now)}</dcterms:created>'
        + f'<dcterms:modified xsi:type="dcterms:W3CDTF">{escape(now)}</dcterms:modified>'
        + "</cp:coreProperties>"
    )


def _docprops_app_xml(slide_count: int):
    return (
        _xml_decl()
        + '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" '
        + 'xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">'
        + "<Application>Codex</Application>"
        + f"<Slides>{slide_count}</Slides>"
        + "</Properties>"
    )


def _shape_xml(shape_id: int, name: str, x: int, y: int, cx: int, cy: int, paragraphs_xml: str, no_fill: bool):
    fill = "<a:noFill/>" if no_fill else '<a:solidFill><a:srgbClr val="FFFFFF"/></a:solidFill>'
    return (
        '<p:sp>'
        + '<p:nvSpPr>'
        + f'<p:cNvPr id="{shape_id}" name="{escape(name)}"/>'
        + '<p:cNvSpPr txBox="1"/>'
        + "<p:nvPr/>"
        + "</p:nvSpPr>"
        + "<p:spPr>"
        + f'<a:xfrm><a:off x="{x}" y="{y}"/><a:ext cx="{cx}" cy="{cy}"/></a:xfrm>'
        + f'<a:prstGeom prst="rect"><a:avLst/></a:prstGeom>{fill}'
        + "</p:spPr>"
        + '<p:txBody><a:bodyPr wrap="square"/><a:lstStyle/>'
        + paragraphs_xml
        + "</p:txBody>"
        + "</p:sp>"
    )


def _run_xml(text: str, *, size: int, bold: bool = False, color: str = "111827"):
    b = ' b="1"' if bold else ""
    return (
        '<a:r>'
        + f'<a:rPr lang="en-US" sz="{size}"{b}>'
        + f'<a:solidFill><a:srgbClr val="{escape(color)}"/></a:solidFill>'
        + '<a:latin typeface="Calibri"/>'
        + "</a:rPr>"
        + f"<a:t>{escape(text)}</a:t>"
        + "</a:r>"
    )


def _paragraph_xml(text: str, *, size: int, bold: bool = False, bullet: bool = False):
    if bullet:
        ppr = (
            '<a:pPr lvl="0" marL="457200" indent="-228600">'
            '<a:buChar char="•"/>'
            "</a:pPr>"
        )
    else:
        ppr = "<a:pPr/>"
    return "<a:p>" + ppr + _run_xml(text, size=size, bold=bold) + '<a:endParaRPr lang="en-US"/>' + "</a:p>"


def _slide_xml(title: str, bullets: list[str] | None = None, subtitle: str | None = None):
    title_x = int(0.7 * EMU_PER_INCH)
    title_y = int(0.45 * EMU_PER_INCH)
    title_cx = SLIDE_CX - int(1.4 * EMU_PER_INCH)
    title_cy = int(1.0 * EMU_PER_INCH)

    body_x = int(0.9 * EMU_PER_INCH)
    body_y = int(1.55 * EMU_PER_INCH)
    body_cx = SLIDE_CX - int(1.8 * EMU_PER_INCH)
    body_cy = SLIDE_CY - int(2.25 * EMU_PER_INCH)

    paragraphs = _paragraph_xml(title, size=5200, bold=True, bullet=False)
    title_shape = _shape_xml(2, "Title", title_x, title_y, title_cx, title_cy, paragraphs, no_fill=True)

    content_parts = []
    shape_id = 3
    if subtitle:
        content_parts.append(_paragraph_xml(subtitle, size=3200, bold=False, bullet=False))
        content_parts.append("<a:p><a:pPr/><a:endParaRPr lang=\"en-US\"/></a:p>")
    if bullets:
        for b in bullets:
            content_parts.append(_paragraph_xml(b, size=2800, bold=False, bullet=True))
    content_xml = "".join(content_parts) if content_parts else _paragraph_xml("", size=2800, bullet=False)
    body_shape = _shape_xml(shape_id, "Content", body_x, body_y, body_cx, body_cy, content_xml, no_fill=True)

    return (
        _xml_decl()
        + '<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" '
        + 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" '
        + 'xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">'
        + "<p:cSld>"
        + "<p:spTree>"
        + '<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>'
        + '<p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/>'
        + '<a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>'
        + title_shape
        + body_shape
        + "</p:spTree>"
        + "</p:cSld>"
        + '<p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>'
        + "</p:sld>"
    )


def _slide_rels_xml():
    return _rels_xml(
        [
            (
                "rId1",
                "http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout",
                "../slideLayouts/slideLayout1.xml",
            )
        ]
    )


def build_pptx(output_path: str, slides: list[dict]):
    output_path = os.path.abspath(output_path)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    with zipfile.ZipFile(output_path, "w", compression=zipfile.ZIP_DEFLATED) as z:
        slide_count = len(slides)

        # Package roots
        z.writestr("[Content_Types].xml", _content_types_xml(slide_count))
        z.writestr(
            "_rels/.rels",
            _rels_xml(
                [
                    (
                        "rId1",
                        "http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument",
                        "ppt/presentation.xml",
                    ),
                    (
                        "rId2",
                        "http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties",
                        "docProps/core.xml",
                    ),
                    (
                        "rId3",
                        "http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties",
                        "docProps/app.xml",
                    ),
                ]
            ),
        )

        # Doc props
        z.writestr("docProps/core.xml", _docprops_core_xml("StudyMate.ai Presentation"))
        z.writestr("docProps/app.xml", _docprops_app_xml(slide_count))

        # Presentation parts
        z.writestr("ppt/presentation.xml", _presentation_xml(slide_count))
        z.writestr("ppt/_rels/presentation.xml.rels", _presentation_rels_xml(slide_count))

        # Master/layout/theme
        z.writestr("ppt/slideMasters/slideMaster1.xml", _slide_master_xml())
        z.writestr("ppt/slideMasters/_rels/slideMaster1.xml.rels", _slide_master_rels_xml())
        z.writestr("ppt/slideLayouts/slideLayout1.xml", _slide_layout_xml())
        z.writestr("ppt/slideLayouts/_rels/slideLayout1.xml.rels", _slide_layout_rels_xml())
        z.writestr("ppt/theme/theme1.xml", _theme_xml())

        # Slides
        for i, s in enumerate(slides, start=1):
            z.writestr(f"ppt/slides/slide{i}.xml", _slide_xml(s["title"], s.get("bullets"), s.get("subtitle")))
            z.writestr(f"ppt/slides/_rels/slide{i}.xml.rels", _slide_rels_xml())

    return output_path


def main():
    slides = [
        {
            "title": "StudyMate.ai",
            "subtitle": "AI‑Powered PDF Study Assistant\nProject Presentation | 04 Apr 2026",
        },
        {
            "title": "Problem Statement",
            "bullets": [
                "PDFs are static; learning becomes passive and slow.",
                "Students waste time searching explanations & clearing doubts.",
                "No quick self‑assessment/revision from the same material.",
                "Language barrier: not everyone prefers English-only content.",
            ],
        },
        {
            "title": "Proposed Solution",
            "bullets": [
                "Upload academic PDF → get page‑wise AI explanations.",
                "Ask doubts in chat with context from the PDF.",
                "Generate quizzes + revision packs to reinforce learning.",
                "Supports English, Hindi, and Hinglish responses.",
            ],
        },
        {
            "title": "Core Features",
            "bullets": [
                "PDF upload & cloud storage (Cloudinary).",
                "Page rendering + text extraction (PyMuPDF).",
                "OCR for scanned pages/figures (Tesseract + OpenCV).",
                "AI explanations using Gemini 2.5 Flash.",
                "Quiz generation and revision pack generation.",
                "Conversation history stored in MongoDB.",
            ],
        },
        {
            "title": "Tech Stack",
            "bullets": [
                "Frontend: React 19, Vite, Tailwind CSS, React Router, Markdown rendering.",
                "Backend: Flask REST API, flask-cors, JWT auth, bcrypt.",
                "Database: MongoDB Atlas.",
                "Storage: Cloudinary for PDFs/images.",
                "AI/ML: Google Gemini, BLIP captioning (Transformers + PyTorch).",
            ],
        },
        {
            "title": "High‑Level Architecture",
            "bullets": [
                "React client calls Flask APIs for auth + PDF actions.",
                "Backend orchestrates parsing + AI prompts + persistence.",
                "MongoDB stores users, PDFs metadata, conversations, outputs.",
                "Cloudinary stores uploaded PDFs and derived images.",
                "Gemini generates explanations, doubts answers, quizzes.",
            ],
        },
        {
            "title": "PDF Processing Pipeline",
            "bullets": [
                "Split PDF into pages.",
                "Extract selectable text via PyMuPDF.",
                "Render page image; OCR if needed for scanned content.",
                "Caption images (BLIP) when useful for diagrams/figures.",
                "Merge context → prompt Gemini for explanation/QA/quiz.",
                "Store page outputs for fast re‑use.",
            ],
        },
        {
            "title": "Key APIs (Backend)",
            "bullets": [
                "POST /upload → upload & register PDF.",
                "POST /parse-page → generate explanation for a page.",
                "POST /ask-doubt → ask questions about content.",
                "POST /generate-quiz → quiz from selected pages.",
                "POST /generate-revision-pack → quick revision notes.",
                "/api/auth/* and /api/conversations/* for auth + chat history.",
            ],
        },
        {
            "title": "Security & Data Handling",
            "bullets": [
                "JWT-based authentication; access tokens for protected routes.",
                "Passwords hashed using bcrypt.",
                "CORS configured for allowed frontend origins.",
                "Server manages Cloudinary uploads and resource URLs.",
                "MongoDB ObjectIds used for resource addressing.",
            ],
        },
        {
            "title": "Demo Walkthrough",
            "bullets": [
                "Register/Login",
                "Upload a PDF",
                "Open a page → get AI explanation",
                "Ask a doubt → get context-aware answer",
                "Generate a quiz and attempt it",
                "Create a revision pack for quick revision",
            ],
        },
        {
            "title": "Conclusion & Future Scope",
            "bullets": [
                "Turns PDFs into an interactive learning experience.",
                "Saves time: explain → doubt → quiz → revision in one place.",
                "Future: citations per answer, semantic search, progress tracking.",
                "Future: better OCR/layout handling, classroom/teacher features.",
                "Thank you! Questions?",
            ],
        },
    ]

    out = build_pptx("StudyMate.ai_Presentation.pptx", slides)
    print(out)


if __name__ == "__main__":
    main()

