"""Add pgvector embeddings to document chunks."""

import sqlalchemy as sa
from alembic import op
from pgvector.sqlalchemy import Vector

revision = "0004_add_chunk_embeddings"
down_revision = "0003_document_chunks"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    if bind.dialect.name == "postgresql":
        op.execute("CREATE EXTENSION IF NOT EXISTS vector")
    op.add_column("document_chunks", sa.Column("embedding", Vector(384), nullable=True))


def downgrade() -> None:
    op.drop_column("document_chunks", "embedding")
